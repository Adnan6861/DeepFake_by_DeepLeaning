import { generateProjectPlanDocx } from '../src/services/docxGenerator.ts';
import fs from 'fs';
import path from 'path';

async function main() {
  const blob = await generateProjectPlanDocx();
  const buffer = Buffer.from(await blob.arrayBuffer());
  
  const publicDir = path.resolve('public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  const filename = 'AI_Deepfake_Detection_System_40_Percent_Milestone_Plan_NUML.docx';
  fs.writeFileSync(filename, buffer);
  fs.writeFileSync(path.join(publicDir, filename), buffer);
  console.log(`Successfully generated ${filename} (${buffer.length} bytes)`);
}

main().catch(console.error);
