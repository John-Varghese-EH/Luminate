import { promises as fsPromises } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import yaml from 'yaml';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const STYLES_DIR = path.resolve(__dirname, '../re/notebooklm-prompt-styles-main/styles');
const OUTPUT_FILE = path.resolve(__dirname, '../public/presentation-styles.json');

async function compileStyles() {
  try {
    const files = await fsPromises.readdir(STYLES_DIR);
    const yamlFiles = files.filter(f => f.endsWith('.yaml') || f.endsWith('.yml'));
    
    const styles = [];

    for (const file of yamlFiles) {
      const filePath = path.join(STYLES_DIR, file);
      const content = await fsPromises.readFile(filePath, 'utf8');
      
      try {
        const parsed = yaml.parse(content);
        parsed.id = path.basename(file, path.extname(file));
        
        if (!parsed.name) {
          parsed.name = parsed.id.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
        }

        styles.push(parsed);
      } catch (parseError) {
        console.error(`Error parsing ${file}:`, parseError.message);
      }
    }

    styles.sort((a, b) => a.name.localeCompare(b.name));

    await fsPromises.writeFile(OUTPUT_FILE, JSON.stringify(styles, null, 2), 'utf8');
    console.log(`Successfully compiled ${styles.length} styles to ${OUTPUT_FILE}`);
  } catch (error) {
    console.error('Error compiling styles:', error);
    process.exit(1);
  }
}

compileStyles();
