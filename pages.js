const {ipcRenderer} = require('electron')

var fs = require('fs')
var redis = require('redis')

String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};

// Dispatch routine from Main Process
ipcRenderer.on('page', function(e,data){showPage(data.msg)})

// HTML
var HTML = new function() {
    this.ELE = function(typ, parent, txt, css, before) {
        var ele = document.createElement(typ)
        if (css) ele.style.cssText = css
        if (before) {
            before.parentNode.insertBefore(ele, before)
        } else {
            if (parent)
                parent.appendChild(ele)
            else
                document.body.appendChild(ele)
        }
        if (txt) {
            var t = document.createTextNode(txt)
            ele.appendChild(t)
        }
        return ele
    }
    this.Text = function(txt, parent, css) {
        var spn = document.createElement('span')
        var t = document.createTextNode(txt)
        spn.appendChild(t)
        if (css) spn.style.cssText = css
        if (parent)
            parent.appendChild(spn)
        //else
          //  document.body.appendChild(spn)
        return t
    }
}

// CSS Texts
var cssWord = 'display:inline-block;margin:0;width:30%'
var cssTitle = 'display:inline-block;margin:10'
var tss = 'width:400px;text-indent:60px'
var css = 'width:30px;text-align:center'
var dcss = 'color:#F76715;font-weight:bold;font-size:20px'

var titles = {sizing: 'AWARE DATA SIZING', connections: 'REDIS CONNECTIONS'}

// DIVS
var DIVS = {divs:[]}
DIVS.hide = function() {
    var keys = Object.keys(DIVS.divs)
    for (var i = 0; i < keys.length; i++)
        DIVS.divs[keys[i]].style.display = 'none'
}
DIVS.show = function(nm) {
    //alert(nm)
    document.title = titles[nm]
    DIVS.hide()
    if (!DIVS.divs[nm])
        DIVS.divs[nm] = HTML.ELE('div')
    DIVS.divs[nm].style.cssText = 'margin-left:15px'
    DIVS.divs[nm].style.display = 'inline'
    return DIVS.divs[nm]
}

// PAGES
var nmdls, nvars, ndats
function showPage(nm) {
    document.body.style.cssText = 'background-color:#e6f9ff'
    var tbl, tr, td, ac
    var odiv = DIVS.show(nm)
    if (odiv.childNodes.length) return
    odiv.style.cssText = 'margin:0 auto;width:100%'
    var div = HTML.ELE('div',odiv,null,'margin-left:20px;margin-right:20px')
    HTML.ELE('br',div)

    switch (nm) {
        case 'sizing':
            //document.title = 'AWARE DATA SIZING'
            var szDataRow = function(tbl,lblText, n) { 
                tr = HTML.ELE('tr',tbl)
                td = HTML.ELE('td',tr,lblText,tss) 
                var inp = HTML.ELE('input',tr,'',css)
                inp.addEventListener('input', function() { clearMsg(tbl.parent) })
                inp.value = n
                return inp
            }
            tbl = HTML.ELE('table',div)
            nmdls = szDataRow(tbl,'NMDLS (Number of Models):', 3)
            nvars = szDataRow(tbl,'NVARS (Number of Variables per Model):', 3)
            ndats = szDataRow(tbl,'NDATS (Number of IDATs per Variable):', 10)
            HTML.ELE('br',div)
            HTML.ELE('br',div)
            div.Button = HTML.ELE('button',div,'Create L5X Files')
            div.Button.addEventListener('click', function() {saveFiles(div)})
            HTML.ELE('br',div); HTML.ELE('br',div)
            div.Message = HTML.Text(' ',div,dcss)
            break
    }

}
            /*
        case 'connections':
            initConnections()
            var cnDataRow = function(tbl, c) {
                tr = HTML.ELE('tr',tbl)
                td = HTML.ELE('td',tr)
                var r = HTML.ELE('input',td,c.name)
                r.type = 'radio', r.name = 'conct', r.value = c.name
                HTML.Text(c.name + '('+c.server+':'+c.port+')',td)
                HTML.ELE('button',td,'Edit','position:fixed;left:400px')
                HTML.ELE('button',td,'Delete','position:fixed;left:450px')
                tr = HTML.ELE('tr',tbl,null,'height:12px')
            }
            //HTML.ELE('input',div)
            tbl = HTML.ELE('table',div)
            for (var i = 0; i < config.connections.length; i++)
                cnDataRow(tbl, config.connections[i])
                HTML.ELE('br',div)
           // HTML.ELE('input',div)
            HTML.ELE('br',div)
            div.Button = HTML.ELE('button',div,'Add Connection')
            HTML.ELE('br',div)
            //HTML.ELE('input',div)
            //div.Button.addEventListener('click', function() {addConnection(div)})
            HTML.ELE('br',div); HTML.ELE('br',div)
            //ac = HTML.ELE('div',div)
            //HTML.ELE('br',ac)
            //HTML.Text('Name:',div); 
            HTML.ELE('input',div); 
            HTML.Text('Name:',div);
            HTML.ELE('input',div); 
            var addField = function(nm) { 
                //HTML.ELE('input',ac,null,'width:40px')}
                HTML.Text(nm,div,'width:60px'); HTML.ELE('input',div,null,'width:60px')}
            //addField('Name:')
            //HTML.ELE('input',ac,'Name:')
            break
    }
}
/*

// Connections Routines
var sconfig, config, cadd

function initConnections() {
    if (config) return
    sconfig = fs.readFileSync('config.json', 'utf8')
    config = JSON.parse(sconfig)
}
var cname, cserver, cport
function addConnection(div) {
    if (cadd) {
        cadd.style.display = 'inline'
        return
    }
    var css = 'width:120px;margin-right:15px'
    cadd = HTML.ELE('div',div)
    HTML.ELE('br',cadd)
    HTML.Text('Name: ',cadd)
    cname = HTML.ELE('input',cadd,null,css)
    cname.addEventListener('input', function(){})
    cname.value = 'Server1'
    HTML.Text('Server: ',cadd)
    cserver = HTML.ELE('input',cadd,null,css).addEventListener('input', function(){})
    //cname
    HTML.Text('Port: ',cadd)
    cport = HTML.ELE('input',cadd,null,'width:80px;margin-right:10px')
    div.Button = HTML.ELE('button',cadd,'Save')
}
// Sizing Routines
function clearMsg(div) { div.Message.nodeValue = ''}
function saveFiles(div) {
    div.Message.nodeValue = 'Saving Files'
    var files = fs.readdirSync('.')
    for (var i = 0; i < files.length; i++)
        if (files[i].indexOf('Template') != -1)
            editFile(files[i])
    div.Message.nodeValue = 'Done'
}
function editFile(fname) {
    var ln, sv = ''
    var s = fs.readFileSync(fname).toString()
    var lines = s.split('\n')
    for (var i = 0; i < lines.length; i++) {
        ln = lines[i].replaceAll('NMDLS', nmdls.value)
        ln = ln.replaceAll('NVARS', nvars.value)
        ln = ln.replaceAll('NDATS', ndats.value)
        if (sv != '') sv += ','
        sv += ln 
    }
    sv = replaceDate(sv) 
    fname = fname.replace('Template', 'L5X')
    fs.writeFileSync(fname, sv, 'utf8')
}
//"Tue Nov 15 16:23:30 2016"
function dateString(d) {
    d = d || new Date()
    var s = ''
    s += ['Mon','Tues','Wed','Thur','Fri','Sat','Sun'][d.getDay()-1]
    s += ' '
    s += ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][d.getMonth()]
    s += ' ' + d.getDay() + ' ' + d.getHours() + ':' + pad(d.getMinutes()) + ':' + pad(d.getSeconds())
    s += ' ' + d.getFullYear()
    return s
}
function replaceDate(s) {
    var n = s.indexOf('ExportDate="') + 'ExportDate="'.length
    var m = s.indexOf('"', n+1)
    return s.substring(0, n) + dateString() + s.substring(m)
}
function pad(s) { s = s.toString(); if (s.length < 2) s = '0'+s; return s }

//showPage('connections')
*/
//showPage('sizing')
