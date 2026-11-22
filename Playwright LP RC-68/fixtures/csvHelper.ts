import * as fs from 'fs';
import * as path from 'path';

export interface RC68Row {
  date?: string;
  time?: string;
  rrn?: string;
  terminalId?: string;
  merchantPan?: string;
  issuer?: string;
  amount?: number | string;
  mid?: string;
  nmid?: string;
  mtn?: string;
}

export function generateRRN(): string {
  const timestamp = Date.now().toString().slice(-8);
  const random = Math.floor(100 + Math.random() * 900).toString();
  return `200${timestamp}${random}`.slice(0, 12);
}

export function generateMTN(): string {
  const prefix = '261000';
  const random = Math.floor(10000000000000 + Math.random() * 90000000000000).toString();
  return `${prefix}${random}`.slice(0, 20);
}

export function createRC68CSV(
  rows: RC68Row[] = [],
  fileName: string = `rc68_test_${Date.now()}.csv`,
  outputDir?: string
): string {
  const dir = outputDir || path.resolve(__dirname, '..', 'test-data');
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  const header = 'Date,Time,RRN,Terminal_ID,Merchant_PAN,Issuer,Amount,MID,NMID,MTN';
  const today = new Date();
  const dateStr = `${String(today.getDate()).padStart(2, '0')}/${String(today.getMonth() + 1).padStart(2, '0')}/${today.getFullYear()}`;

  const defaultRows: RC68Row[] = rows.length > 0 ? rows : [
    {
      date: dateStr,
      time: '08:00:00',
      rrn: generateRRN(),
      terminalId: 'A01',
      merchantPan: '936000010000000001',
      issuer: '93600915',
      amount: 50000,
      mid: '735070326480',
      nmid: '936009238326480',
      mtn: generateMTN(),
    },
    {
      date: dateStr,
      time: '08:10:00',
      rrn: generateRRN(),
      terminalId: 'A01',
      merchantPan: '936000010000000001',
      issuer: '93600915',
      amount: 100000,
      mid: '735070326480',
      nmid: '936009238326480',
      mtn: generateMTN(),
    },
  ];

  const lines = [header];
  for (const r of defaultRows) {
    lines.push([
      r.date || dateStr,
      r.time || '10:00:00',
      r.rrn || generateRRN(),
      r.terminalId || 'A01',
      r.merchantPan || '936000010000000001',
      r.issuer || '93600915',
      r.amount ?? 50000,
      r.mid || '735070326480',
      r.nmid || '936009238326480',
      r.mtn || generateMTN(),
    ].join(','));
  }

  const filePath = path.join(dir, fileName);
  fs.writeFileSync(filePath, lines.join('\r\n'), 'utf-8');
  return filePath;
}

export function createCustomFile(
  content: string,
  fileName: string,
  outputDir?: string
): string {
  const dir = outputDir || path.resolve(__dirname, '..', 'test-data');
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  const filePath = path.join(dir, fileName);
  fs.writeFileSync(filePath, content, 'utf-8');
  return filePath;
}
