//给add button 绑定添加todo事件
var bindEventAdd = function() {
    var addButton = document.querySelector('.button-add')
    addButton.addEventListener('click',function(){
        //获得input框的value
        var todoInput = document.querySelector('.input-todo')
        var task = todoInput.value
        if (task == '') {
            alert('不能为空')
        } else {
            //生成todo对象
            var todo = {
                'task': task,
                'time': currentTime(),
            }
            todoList.push(todo)
            //保存todoList到本地存储
            saveTodos()
            //将todo添加到container中
            insertTodo(todo)
        }
    })
}

var bindEventEnter = function() {
    var todoContainer = document.querySelector('.todo-container')
    todoContainer.addEventListener('keydown',function(event){
        var target = event.target
        if (event.key === 'Enter') {
            //失去焦点
            target.blur()
            //阻止默认行为的发生，也就是不插入回车
            event.preventDefault()
            //更新todo
            var index = indexOfElement(target.parentElement)
            //把元素在todoList中更新
            todoList[index].task = target.innerHTML
            saveTodos()
        }
    })
}

var bindEventButton = function() {
    //事件委托
    //通过 event.target 的class来检查点击的是什么
    var todoContainer = document.querySelector('.todo-container')
    todoContainer.addEventListener('click',function(event){
        var target = event.target
        if (target.classList.contains('todo-done')) {
            //给todo div开关一个状态class
            var cell = target.parentElement
            toggleClass(cell,'done')
        } else if (target.classList.contains('todo-edit')) {
            var cell = target.parentElement
            var span = cell.children[0]
            span.setAttribute('contenteditable','true')
            span.focus()
        } else if (target.classList.contains('todo-delete')) {
            console.log('delete');
            var cell = target.parentElement
            var index = indexOfElement(target.parentElement)
            cell.remove()
            //把元素从 todoList 中 remove 掉
            todoList.splice(index, 1)
            // delete todoList[index]
            saveTodos()
        }
    })
}

var bindEventBlur = function() {
    var todoContainer = document.querySelector('.todo-container')
    todoContainer.addEventListener('blur',function(event){
        var target = event.target
        if (target.classList.contains('todo-label')) {
            target.setAttribute('contenteditable', 'false')
            // 更新 todo
            var index = indexOfElement(target.parentElement)
            todoList[index].task = target.innerHTML
             saveTodos()
        }
    },true) //设置参数true 事件句柄在事件捕获阶段执行；默认的false则在事件冒泡执行
}
//所有绑定事件
var bindEvents = function() {
    //添加todo
    bindEventAdd()
    //文本框输入todo按回车保存
    bindEventEnter()
    //完成按钮和删除按钮
    bindEventButton()
    //文本框失去焦点后保存todo
    bindEventBlur()

}
//这个函数用来开关一个元素的某个class
var toggleClass = function(element,className) {
    if (element.classList.contains(className)) {
        element.classList.remove(className)
    } else {
        element.classList.add(className)
    }
}
//当前时间
var currentTime = function() {
    var d = new Date()
    var month = d.getMonth() + 1
    var date = d.getDate()
    var hours = d.getHours()
    var minutes = d.getMinutes()
    var seconds = d.getSeconds()
    var timeString = `${month}/${date} ${hours}:${minutes}:${seconds}`
    return timeString
}
//保存todoList
var saveTodos = function() {
    var s = JSON.stringify(todoList)
    localStorage.todoList = s
}
//加载todoList
var loadTodos = function() {
    var s = localStorage.todoList
    return JSON.parse(s)
}
//返回当前元素在父元素中的下标
var indexOfElement = function(element) {
    var parent = element.parentElement
    console.log(element.parentElement.children);
    for (var i = 0; i < parent.children.length; i++) {
        var e = parent.children[i]
        if (e === element) {
            return i
        }
    }
}

var insertTodo = function(todo) {
    //将todo添加到container中
    var todoContainer = document.querySelector('.todo-container')
    var t = templateTodo(todo)
    //这个方法用来添加元素更加方便，不需要createElement
    todoContainer.insertAdjacentHTML('beforeend',t)
}
//需插入的todo模板
var templateTodo = function(todo) {
    var t = `
        <div class='todo-cell'>
            <span class='todo-label' contenteditable='false'>${todo.task}</span>
            <span class='todo-date-time'>${todo.time}</span>
            <button class='todo-done'>完成</button>
            <button class='todo-edit'>编辑</button>
            <button class='todo-delete'>删除</button>

        </div>
    `
    return t
}

var initTodos = function() {
    todoList = loadTodos()
    for (var i = 0; i < todoList.length; i++) {
        var todo = todoList[i]
        insertTodo(todo)
    }
}
//todo列表
var todoList = []
//程序入口
var _main = function() {
    //绑定事件
    bindEvents()
    //程序加载后，加载todoList并且添加到页面中
    initTodos()
}

_main()
