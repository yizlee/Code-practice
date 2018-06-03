var hero = [
    { name:'钢铁侠', src:'1.jpg',company:'Marvel',des:'最帅唐尼'},
    { name:'神奇女侠', src:'2.jpg',company:'DCHero',des:'大长腿盖尔加朵'},
    { name:'蜘蛛侠', src:'3.jpg',company:'Marvel',des:'逗比荷兰弟'},
    { name:'美国队长', src:'4.jpg',company:'Marvel',des:'最挫制服没有之一'},
    { name:'浩克', src:'5.jpg',company:'Marvel',des:'寡妇爱的班纳'},
    { name:'超人', src:'6.jpg',company:'DCHero',des:'吊打所有英雄'},
    { name:'闪电侠', src:'7.jpg',company:'DCHero',des:'快男快男快男'}
];

var listUl = document.getElementById('list');
var oinput = document.getElementById('ipt');
var oUl = document.getElementById('searchUl');
function render(list){
    var str = '';
    list.forEach(function (ele, index){
        str += '<li>\
            <img src="./img/' + ele.src + '" alt="">\
            <span class="name">' + ele.name + '</span>\
            <span class="des">' + ele.des + '</span>\
            </li>'
    });
    listUl.innerHTML = str;
}
render(hero);

oinput.oninput = function(){
    state.text = this.value;
   render(addFn(method,hero));
}

function filterText(text, arr){
    return arr.filter(function(ele,index){
        if(ele.name.indexOf(text) !== -1 || ele.des.indexOf(text) !== -1){
            return true;
        }
    })
}

oUl.addEventListener('click',function(e){
    if(e.target.tagName == 'LI'){
        state.company = e.target.getAttribute('company');
        document.getElementsByClassName('active')[0].classList.remove('active');
        e.target.classList.add('active');
        render(addFn(method,hero));
    }
})

function filterCompany(com,arr){
    if(com == 'All'){
        return arr;
    }else{
        return arr.filter(function(ele,index){
            if(com == ele.company){
                return true;
            }
        })
    }    
}

var state = {
    text: '',
    company : 'All'
}

var method = {
    text:filterText,
    company:filterCompany,
}

function addFn(obj,arr){
    var newarr = arr;
    for(var prop in obj){
        newarr = obj[prop](state[prop],newarr);
    }
    return newarr;
}