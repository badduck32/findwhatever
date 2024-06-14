let isFrame,
    treeWalker,
    allNodes,
    currentNode,
    setting = {},
    filteredRangeList = [],
    rangesFlat;

isFrame = window !== window.top;

// 创建 DOM 监听器
const observer = new MutationObserver(() => {
    reCheckTree(); // 重新生成节点数
    doSearch(); // 然后执行搜索
})

// 创建一个自定义的弹出窗口
const createPopup = async () => {
    const popup = document.createElement('div');
    popup.id = 'searchWhateverPopup';
    popup.style.position = 'fixed';
    popup.style.top = '10%';
    popup.style.right = '10%';
    popup.style.backgroundColor = '#fff';
    popup.style.boxShadow = '0px 0px 5px 0px rgba(0,0,0,.02),0px 2px 10px 0px rgba(0,0,0,.06),0px 0px 1px 0px rgba(0,0,0,.3)';
    popup.style.zIndex = '10000';
    popup.style.padding = '12px 12px 10px 12px';
    popup.style.borderRadius = '8px';

    // 添加内容
    const content = document.createElement('div');
    content.innerHTML = `<div class="swe_tabsWp">
                            <div class="swe_tabs"></div>
                            <div id="searchwhatever_result">
                                <div class="swe_visible" title="该元素不可见">
                                    <svg class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" width="200" height="200"><path d="M764.394366 588.97307c-93.111887 0-170.503211 64.930254-190.69476 151.667381-47.118423-20.148282-90.861972-14.552338-123.399212-0.562479C429.546366 653.340845 352.155042 588.97307 259.605634 588.97307c-108.255549 0-196.305127 87.862085-196.305127 195.886874C63.300507 892.87031 151.350085 980.732394 259.605634 980.732394c103.207662 0 186.771831-79.468169 194.61769-180.209577 16.831099-11.754366 61.151549-33.575662 115.553352 1.124958C578.747493 901.826704 661.749183 980.732394 764.394366 980.732394c108.255549 0 196.305127-87.862085 196.305127-195.87245 0-108.024789-88.049577-195.886873-196.305127-195.886874z m-504.788732 55.959437c77.405746 0 140.215887 62.694761 140.215887 139.927437 0 77.232676-62.810141 139.898592-140.215887 139.898591-77.405746 0-140.215887-62.665915-140.215888-139.898591 0-77.232676 62.810141-139.927437 140.215888-139.927437z m504.788732 0c77.405746 0 140.215887 62.694761 140.215888 139.927437 0 77.232676-62.810141 139.898592-140.215888 139.898591-77.405746 0-140.215887-62.665915-140.215887-139.898591 0-77.232676 62.810141-139.927437 140.215887-139.927437zM1016.788732 475.943662H7.211268v57.690141h1009.577464v-57.690141zM697.675718 77.016338c-11.538028-26.249014-41.334986-40.094648-69.011831-30.907493L512 85.294873l-117.226366-39.186028-2.769127-0.836507c-27.806648-7.687211-57.026704 7.355493-67.338817 34.426592L196.78107 418.253521h630.43786L698.771831 79.69893l-1.096113-2.682592z"></path></svg>
                                    <div class="swe_visibleStatus">不可见</div>
                                </div>
                                搜索结果：<span class="swe_current">0</span> / <span class="swe_total">0</span>
                            </div>
                         </div>
                         <div class="swe_searchWp">
                            <div class="swe_search">
                                <img class="swe_search_icon" src="https://i0.letvimg.com/lc19_lemf/202406/12/11/10/search.png" alt="">
                                <input id="searchInput" autofocus type="text" placeholder="搜索" />
                                <div class="swe_toolbar">
                                    <div class="swe_prev"><img src="https://i1.letvimg.com/lc19_lemf/202406/12/11/11/up.png" alt="上一个"></div>
                                    <div class="swe_next"><img src="https://i1.letvimg.com/lc19_lemf/202406/12/11/11/up.png" alt="下一个"></div>
                                    <span id="matchCase">Cc</span>
                                    <span id="word">W</span>
                                    <span id="reg">.*</span>
                                </div>
                            </div>
                            <div class="swe_close">
                                <svg class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" width="32" height="32"><path d="M12.47232 12.51328C26.74688-1.76128 49.5104-2.90816 65.15712 9.84064l2.93888 2.70336L1009.664 955.37152c14.96064 14.80704 15.62624 38.76864 1.51552 54.38464-14.12096 15.616-38.02112 17.3568-54.26176 3.95264l-2.9696-2.70336L12.41088 68.17792c-15.34976-15.39072-15.31904-40.30464 0.06144-55.66464z m0 0" fill="#2C2C2C" /><path d="M1009.67424 12.51328c-14.2848-14.27456-37.04832-15.42144-52.69504-2.67264l-2.99008 2.70336L12.41088 955.37152c-14.96064 14.80704-15.62624 38.76864-1.51552 54.38464 14.12096 15.616 38.02112 17.3568 54.25152 3.95264l2.9696-2.70336 941.568-942.82752c15.34976-15.38048 15.32928-40.30464-0.0512-55.66464h0.04096z m0 0" fill="#2C2C2C" /></svg>
                            </div>
                         </div>
`
    const { frames } = await chrome.storage.session.get(['frames']);
    for (let i=0; i<frames.length; i++) {
        content.querySelector('.swe_tabs').innerHTML +=`<button class="${i === 0 ? 'active' : ''}" data-frameid="${frames[i].frameId}">
            <div>${ i === 0 ? '当前页' : `iframe${i}` }</div>
        </button>`
    }
    popup.appendChild(content);
    popup.getElementsByClassName('swe_close')[0].onclick = async () => {
        observer.disconnect()
        CSS.highlights.clear();
        document.body.removeChild(popup);
        chrome.storage.onChanged.removeListener(handleStorageChange)
        await chrome.storage.session.set({ resultSum: [] })
    }
    document.body.appendChild(popup);
}

// 生成匹配节点树
const reCheckTree = () => {
    treeWalker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, (node) => {
        // 父元素是 svg、script、script 的时候，不置入范围
        if (['svg', 'STYLE', 'SCRIPT'].includes(node.parentNode.nodeName)) {
            return NodeFilter.FILTER_REJECT
        } else {
            return NodeFilter.FILTER_ACCEPT
        }
    })

    allNodes = [];
    currentNode = treeWalker.nextNode();
    while (currentNode) {
        allNodes.push({ el: currentNode, text: currentNode.textContent })
        currentNode = treeWalker.nextNode();
    }
}

const start = async () => {
    const searchInput = document.querySelector('#searchWhateverPopup #searchInput'); // 搜索框
    const matchCaseButton = document.querySelector('#searchWhateverPopup #matchCase');
    const wordButton = document.querySelector('#searchWhateverPopup #word');
    const regButton = document.querySelector('#searchWhateverPopup #reg');

    chrome.storage.onChanged.addListener(handleStorageChange)
    setting = await chrome.storage.sync.get(['searchValue', 'isMatchCase', 'isWord', 'isReg']); // 缓存值

    // 仅在主界面进行一些 dom 的操作，frame 内的只搜索
    if (!isFrame) {
        // 获取用户选中的文本，有就立即填进去
        const selection = window.getSelection().toString();
        if (selection) {
            searchInput.value = selection;
            chrome.storage.sync.set({ searchValue: selection })
            setting.searchValue = selection;
        } else if (setting.searchValue) {
            searchInput.value = setting.searchValue;
        }
        if (setting.isMatchCase) {
            matchCaseButton.classList.add('active')
        }
        if (setting.isWord) {
            wordButton.classList.add('active')
        }
        if (setting.isReg) {
            regButton.classList.add('active')
        }

        searchInput.oninput = async (e) => {
            const value = e.target.value.trim();
            // 向背景脚本发送消息以获取当前标签信息
            await chrome.storage.sync.set({ searchValue: value })
            setting.searchValue = value;
        }
        searchInput.onkeydown = (e) => {
            if (e.key === 'Enter') {
                doNext();
            }
        }

        matchCaseButton.onclick = async (e) => {
            const { classList } = e.currentTarget
            const isActive = classList.contains('active')
            if (isActive) {
                classList.remove('active')
            } else {
                classList.add('active')
            }
            await chrome.storage.sync.set({ isMatchCase: !isActive })
            setting.isMatchCase = !isActive
        }

        wordButton.onclick = async (e) => {
            const { classList } = e.currentTarget
            const isActive = classList.contains('active')
            if (isActive) {
                classList.remove('active')
            } else {
                classList.add('active')
            }
            await chrome.storage.sync.set({ isWord: !isActive })
            setting.isWord = !isActive
        }

        regButton.onclick = async (e) => {
            const { classList } = e.currentTarget
            const isActive = classList.contains('active')
            if (isActive) {
                classList.remove('active')
            } else {
                classList.add('active')
            }
            await chrome.storage.sync.set({ isReg: !isActive })
            setting.isReg = !isActive
        }

        document.querySelector('#searchWhateverPopup .swe_toolbar .swe_prev').onclick = async () => {
            let { activeResult, resultSum } = await chrome.storage.session.get(['activeResult', 'resultSum']);
            const sum = resultSum.map(r => r.sum).reduce((a,b) => a + b, 0);
            activeResult = activeResult || 1;
            activeResult--;
            if (activeResult <= 0) {
                activeResult = sum
            }
            await chrome.storage.session.set({ activeResult: activeResult})

            observer.disconnect()
            document.querySelector('#searchWhateverPopup #searchwhatever_result .swe_current').innerText = activeResult;
            observer.observe(document.body, {
                subtree: true, // 监听以 target 为根节点的整个子树。包括子树中所有节点的属性，而不仅仅是针对 target。
                childList: true, // 监听 target 节点中发生的节点的新增与删除（同时，如果 subtree 为 true，会针对整个子树生效）。
                attributes: false, // 不监听属性值
                characterData: true // 监听声明的 target 节点上所有字符的变化。
            })
        }

        document.querySelector('#searchWhateverPopup .swe_toolbar .swe_next').onclick = doNext;

        let tabButton = document.querySelectorAll('.swe_tabs button')
        for (let i in tabButton) {
            tabButton[i].onclick = async (e) => {
                const { frameid } = e.currentTarget.dataset
                const { resultSum } = await chrome.storage.session.get(['resultSum'])

                let current = 0;
                for (let item of resultSum) {
                    if (item.frameId !== +frameid) {
                        current += item.sum;
                    } else {
                        break;
                    }
                }
                await chrome.storage.session.set({ activeResult: current + 1})
                observer.disconnect()
                document.querySelector('#searchWhateverPopup #searchwhatever_result .swe_current').innerText = current + 1;
                observer.observe(document.body, {
                    subtree: true, // 监听以 target 为根节点的整个子树。包括子树中所有节点的属性，而不仅仅是针对 target。
                    childList: true, // 监听 target 节点中发生的节点的新增与删除（同时，如果 subtree 为 true，会针对整个子树生效）。
                    attributes: false, // 不监听属性值
                    characterData: true // 监听声明的 target 节点上所有字符的变化。
                })
            }
        }
    }

    // 启动后立即进行一次搜索
    doSearch()
}

async function doSearch() {
    const { isMatchCase, searchValue, isWord, isReg } = setting; // 从本地获取 setting，比 storage 里获取快很多
    CSS.highlights.clear(); // 清除所有高亮

    if (searchValue) { // 如果有搜索词
        filteredRangeList = [] // 清除之前搜索到的匹配结果的 dom 集合

        rangesFlat = allNodes.map(({ el, text }) => {
            const indices = [];
            let startPos = 0;

            // 根据筛选项，设置正则表达式
            let regContent = searchValue
            if (!isReg) {
                regContent = regContent.replace(/([^a-zA-Z0-9_ \n])/g, '\\$1')
            }
            if (isWord) {
                regContent = `\\b${regContent}\\b`
            }
            let execResLength = searchValue.value; // 匹配结果的长度，一般情况下等于字符长度，如果是正则，就得是正则结果的长度
            const reg = new RegExp(regContent, `${isMatchCase ? '' : 'i'}dg`);

            while (startPos < text.length) {
                let index;
                reg.lastIndex = 0;
                const res = reg.exec(text.substring(startPos));

                if (res) {
                    index = res.indices[0][0]
                    execResLength = res.indices[0][1] - res.indices[0][0]
                    indices.push(startPos + index);
                    startPos += index + execResLength;
                } else {
                    break;
                }
            }

            return indices.map((index) => {
                const range = new Range();
                filteredRangeList.push(el.parentElement)
                range.setStart(el, index);
                range.setEnd(el, index + execResLength);
                return range;
            })
        }).flat()
    } else {
        rangesFlat = []
    }

    const searchResultsHighlight = new Highlight(...rangesFlat)
    CSS.highlights.set('search-results', searchResultsHighlight)

    // 向背景脚本发送消息以获取当前标签信息
    chrome?.runtime?.sendMessage({
        action: 'saveResult',
        data: {
            isFrame,
            resultNum: rangesFlat.length
        }
    });
}

const doNext = async () => {
    let { activeResult, resultSum } = await chrome.storage.session.get(['activeResult', 'resultSum']);
    const sum = resultSum.map(r => r.sum).reduce((a,b) => a + b, 0);
    activeResult = activeResult || 1;
    activeResult++;
    if (activeResult > sum) {
        activeResult = 1
    }
    await chrome.storage.session.set({ activeResult: activeResult})

    observer.disconnect()
    document.querySelector('#searchWhateverPopup #searchwhatever_result .swe_current').innerText = activeResult;
    observer.observe(document.body, {
        subtree: true, // 监听以 target 为根节点的整个子树。包括子树中所有节点的属性，而不仅仅是针对 target。
        childList: true, // 监听 target 节点中发生的节点的新增与删除（同时，如果 subtree 为 true，会针对整个子树生效）。
        attributes: false, // 不监听属性值
        characterData: true // 监听声明的 target 节点上所有字符的变化。
    })
}

const handleStorageChange = async (changes, areaName) => {
    if (areaName === 'session') {
        if (!isFrame && changes.visibleStatus !== undefined) {
            document.querySelector('#searchWhateverPopup .swe_visible').title = changes.visibleStatus.newValue;
            document.querySelector('#searchWhateverPopup .swe_visible').style.opacity = changes.visibleStatus.newValue ? 1 : 0;
        }
    }
}

// 获取元素的隐藏状态，返回一个描述元素不可见的原因的字符串，如果不为空，说明元素不可见
const isElementVisible = (el) => {
    const rect = el.getBoundingClientRect();
    if (rect.width === 0 && rect.height === 0) {
        return '隐藏中'
    } else {
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const topElement = document.elementFromPoint(centerX, centerY);
        if (el !== topElement && !el.contains(topElement) && !topElement.contains(el)) {
            return '被其他元素遮盖'
        }
    }
    return '';
}
