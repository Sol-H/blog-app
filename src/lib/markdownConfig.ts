import { marked } from 'marked';
import Prism from 'prismjs';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-tsx';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-markdown';
import 'prismjs/components/prism-bash';

export function configureMarked() {
  // Set up the custom renderer
  const renderer = new marked.Renderer();
  
  // Override the code block rendering
  renderer.code = ({ text, lang, escaped }) => {
    if (lang && Prism.languages[lang]) {
      try {
        const highlighted = Prism.highlight(text, Prism.languages[lang], lang);
        return `<pre><code class="language-${lang}">${highlighted}</code></pre>`;
      } catch (e) {
        console.error('Prism highlighting error:', e);
      }
    }
    // Fallback for unknown languages
    return `<pre><code>${escaped ? text : marked.parseInline(text)}</code></pre>`;
  };

  marked.use({ 
    renderer,
    gfm: true,
    breaks: true,
  });
}
