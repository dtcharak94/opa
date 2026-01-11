const cache = new Map();

export async function loadTemplate(path, selector) {
  if (!cache.has(path)) {
    const html = await fetch(path).then((r) => r.text());
    const tpl = document.createElement("template");
    tpl.innerHTML = html;
    cache.set(path, tpl);
  }

  return cache.get(path).content.querySelector(selector);
}
