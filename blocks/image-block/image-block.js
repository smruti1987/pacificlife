export default async function decorate(block) {
  const linkTag = document.createElement('a');
  const firstPara = block.querySelector('p');
  const linkHref = block.querySelector('.button').getAttribute('href');
  const newWindow = block.lastElementChild.children.innerHTML;

  if (linkHref) {
    linkTag.setAttribute('href', linkHref);

    if (newWindow === true) {
      linkTag.setAttribute('target', '_blank');
    }

    linkTag.innerHTML = firstPara.innerHTML;
    firstPara.parentNode.replaceChild(linkTag, firstPara);

    [...block.children].forEach((row, i) => {
      if (i !== 0) {
        row.remove();
      }
    });
  }
}
