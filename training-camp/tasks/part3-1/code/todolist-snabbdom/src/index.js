import { init, h } from 'snabbdom'
import eventlisteners from 'snabbdom/modules/eventlisteners'
// import props from 'snabbdom/modules/props'
import data from './data'
import './index.scss'

const patch = init([eventlisteners])

const state = {
  active: 0
}
let currDataIndex = data.length
const tabOptions = [
  { label: 'Rank', value: 'rank' },
  { label: 'Title', value: 'title' },
  { label: 'Description', value: 'desc' }
]
const Header = h(
  'h1',
  'Top 10 movies'
)
const getTabsComp = (state) => {
  return h(
    'div.table-operation',
    [
      h('div.tabs-container', [
        'Sort by：',
        h('ul', tabOptions.map((item, i) => (
          h(
            'li.btn' + (state.active === i ? '.active' : ''),
            {
              key: i,
              on: {
                click: () => {
                  if (state.active !== i) {
                    state.active = i
                    update()
                  }
                }
              }
            },
            item.label
          )
        )))
      ]),
      h(
        'button.btn',
        {
          on: {
            click: () => {
              currDataIndex += 1
              data.push({
                rank: currDataIndex + 1 + '',
                title: currDataIndex + 'title',
                desc: currDataIndex + 'desc'
              })
              update()
            }
          }
        },
        'Add'
      )
    ]
  )
}
const getTable = state => {
  const orderField = tabOptions[state.active]?.value
  const list = [...data]

  if (orderField) {
    list.sort((a, b) => a[orderField]?.charCodeAt?.() - b[orderField]?.charCodeAt?.())
  }
  return (
    h('div.table', list.map((item, i) => (
      h('div.row', { key: item.id }, [
        h('div.col', item.rank),
        h('div.col', item.title),
        h('div.col', item.desc),
        h('div.del', {
          on: {
            click: () => {
              data.splice(i, 1)
              update()
            }
          }
        }, '×')
      ])
    )))
  )
}

let vnode = document.getElementById('app')
function update () {
  const Tabs = getTabsComp(state)
  const Table = getTable(state)
  const App = h(
    'div.todo-list',
    [Header, Tabs, Table]
  )

  vnode = patch(vnode, App)
}

update()
