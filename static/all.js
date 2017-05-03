fetch('svgs', {
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    },
})
.then(result => result.json())
.then(svgs => {
    svgs.forEach(svg => {
        var container = document.createElement('div');
        container.innerHTML = svg;
        document.body.appendChild(container);
    })
})
