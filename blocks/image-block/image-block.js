export default async function decorate(block) {
  const image = block.querySelector('picture');
  const linkHref = block.querySelector('.button').getAttribute('href');
  if (image && linkHref) {
    const anchor = document.createElement('a');
    anchor.setAttribute('href', linkHref);
    image.parentNode.insertBefore(anchor, image);
    anchor.appendChild(image);
    [...block.children].forEach((row, i) => {
      if (i !== 0) {
        row.remove();
      }
    });
  }
}
