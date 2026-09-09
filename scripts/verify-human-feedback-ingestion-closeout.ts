#!/usr/bin/env node
import { OPEN_EVO_BRIEFING_CLOSEOUT_20260909 } from '../src/data/humanFeedbackIngestionCloseouts';
import { completionReceipt } from '../src/lib/humanFeedbackIngestionCloseout';

const receipt = completionReceipt(OPEN_EVO_BRIEFING_CLOSEOUT_20260909);
process.stdout.write(JSON.stringify(receipt, null, 2) + '\n');
if (receipt.status !== 'PASS') process.exit(1);
