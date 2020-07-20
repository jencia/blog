import createHeading from './heading.js'
import './main.css'
import icon from './demo.png'
import footer from './footer.html'

const heading = createHeading()
document.body.append(heading)

const img = new Image()
img.src = icon
document.body.append(img);

const div = document.createElement('div');
div.innerHTML = footer;
document.body.append(div);