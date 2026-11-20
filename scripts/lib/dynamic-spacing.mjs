/** Audit actual DOM/React style sinks, not similarly named chart-data fields. */
import ts from 'typescript';
import postcss from 'postcss';
import { isSpacingProperty, normalizeSpacingValue } from './sitewide-spacing.mjs';

export function inspectDynamicSpacing(content,file){
  const blocks=file.endsWith('.astro')
    ? [...content.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/g)].map(match=>({code:match[1],offset:content.slice(0,match.index+match[0].indexOf('>')+1).split('\n').length-1}))
    : [{code:content,offset:0}];
  const frontmatter=file.endsWith('.astro')&&/^---\s*\n([\s\S]*?)\n---/.exec(content);
  if(frontmatter)blocks.push({code:frontmatter[1],offset:1});
  const entries=[],errors=[];
  const cssName=value=>value.replace(/[A-Z]/g,letter=>'-'+letter.toLowerCase());
  const literal=node=>node&&(ts.isStringLiteralLike(node)||ts.isNumericLiteral(node))?node.text:null;
  const isStyle=node=>node&&ts.isPropertyAccessExpression(node)&&node.name.text==='style';
  for(const {code,offset} of blocks){
    const source=ts.createSourceFile(file,code,ts.ScriptTarget.Latest,true,ts.ScriptKind.TSX);
    function check(property,node,kind){
      property=cssName(property);
      if(!isSpacingProperty(property))return;
      const at=source.getLineAndCharacterOfPosition(node.getStart(source));
      const entry={file,line:at.line+offset+1,property,kind,value:node.getText(source)};
      entries.push(entry);
      function valid(expression){
        if(ts.isParenthesizedExpression(expression)||ts.isAsExpression(expression)||ts.isTypeAssertionExpression(expression))return valid(expression.expression);
        if(ts.isConditionalExpression(expression))return valid(expression.whenTrue)&&valid(expression.whenFalse);
        const value=literal(expression);
        if(value===null)return false;
        const css=ts.isNumericLiteral(expression)?value+'px':value;
        try{return normalizeSpacingValue(css,'stack')===css;}catch{return false;}
      }
      if(!valid(node))errors.push(file+':'+entry.line+' '+kind+' '+property+' must use shared spacing: '+entry.value);
    }
    function object(node,kind){
      if(!node)return;
      if(ts.isAsExpression(node)||ts.isParenthesizedExpression(node)){object(node.expression,kind);return;}
      if(!ts.isObjectLiteralExpression(node))return;
      for(const property of node.properties)if(ts.isPropertyAssignment(property)){
        const name=ts.isIdentifier(property.name)?property.name.text:literal(property.name);
        if(name)check(name,property.initializer,kind);
      }
    }
    function visit(node){
      if(ts.isBinaryExpression(node)&&node.operatorToken.kind===ts.SyntaxKind.EqualsToken){
        const left=node.left;
        if(ts.isPropertyAccessExpression(left)&&isStyle(left.expression)){
          if(left.name.text==='cssText'&&literal(node.right)!==null){
            postcss.parse('inline{'+literal(node.right)+'}').walkDecls(declaration=>{
              if(isSpacingProperty(declaration.prop)&&normalizeSpacingValue(declaration.value,'stack')!==declaration.value)errors.push(file+' DOM cssText bypasses shared spacing: '+declaration.toString());
            });
          }else check(left.name.text,node.right,'DOM style');
        }
        if(ts.isElementAccessExpression(left)&&isStyle(left.expression)&&literal(left.argumentExpression))check(literal(left.argumentExpression),node.right,'DOM indexed style');
      }
      if(ts.isCallExpression(node)&&ts.isPropertyAccessExpression(node.expression)){
        const call=node.expression;
        if(call.name.text==='setProperty'&&isStyle(call.expression)&&literal(node.arguments[0]))check(literal(node.arguments[0]),node.arguments[1],'DOM setProperty');
        if(call.name.text==='assign'&&call.expression.getText(source)==='Object'&&isStyle(node.arguments[0]))for(const arg of node.arguments.slice(1))object(arg,'DOM Object.assign');
      }
      if(ts.isJsxAttribute(node)&&node.name.getText(source)==='style'&&node.initializer&&ts.isJsxExpression(node.initializer))object(node.initializer.expression,'React style');
      ts.forEachChild(node,visit);
    }
    visit(source);
  }
  return {entries,errors};
}
