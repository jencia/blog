import createHeading from './heading.js'
import './main.css'
import icon from './demo.png'
import footer from './footer.html'

let heading = createHeading()
document.body.append(heading)

const img = new Image()
img.src = icon
document.body.append(img);

const div = document.createElement('div');
div.innerHTML = footer;
document.body.append(div);

if (module.hot) {
    module.hot.accept('./heading', () => {
        const _heading = createHeading()

        document.body.replaceChild(_heading, heading)
        heading = _heading
    })
}