define( function(){
    $.log("视图助手生成模块", 7)

    var helpers = {
        block: function(key, val){
            $.ejs.data[key] = val
        },
        set_layout: function( str ){
            $.ejs.data.layout = str
        },
        set_title: function( str ){
            $.ejs.data.title = str
        },
        push_css: function( file ) {
            var opts = {
                media: 'screen',
                rel: 'stylesheet',
                type: 'text/css'
            };
            var tag = create_tag( file, opts, arguments );
            $.ejs.data.links.push( tag+"\n" );
        },
        unshift_css: function( file ){
            var opts = {
                media: 'screen',
                rel: 'stylesheet',
                type: 'text/css'
            };
            var tag = create_tag( file, opts, arguments );
            $.ejs.data.links.unshift( tag+"\n" );
        },
        add_css : function ( file ) {
            var opts = {
                media: 'screen',
                rel: 'stylesheet',
                type: 'text/css',
                root: 1
            };
            return create_tag( file, opts, arguments );
        },
        push_js: function( file, more ) {
            var opts = {
                type: 'text/javascript'
            };
            $.mix(opts, more || {})
            var tag = create_tag( file, opts, arguments );
            $.ejs.data.scripts.push( tag+"\n" );
        },
        unshift_js: function( file ){
            var opts = {
                type: 'text/javascript'
            };
            var tag = create_tag( file, opts, arguments );
            $.ejs.data.scripts.unshift( tag+"\n" );
        },
        add_js: function( file, more){
            var opts = {
                type: 'text/javascript',
                root: 1
            };
            $.mix(opts, more || {})
            return create_tag( file, opts, arguments );
        }
    }


    var reg_full_path = /^([\w\+\.\-]+:)(?:\/\/([^\/?#:]*)(?::(\d+))?)?/
    function create_tag(file, opts, args){
        args = Array.apply([],args);//转换成纯数组
        if (typeof last === "object" ){
            opts = $.mix( opts, args.pop() );
        }
        if(opts.root){//添加前缀
            if( !reg_full_path.test (file) ) {//如果前面不存在http: https:
                var pre = file.indexOf("/") === 0 ? "" : "/"
                file = $.path.normalize( $.path.join( pre ,file ) ).replace(/\\/g,"/");
            }
            delete opts.root
        }
        var href = checkFile( file );
        if(opts.type == "text/css"){
            delete opts.href;
            return genericTagSelfclosing('link', opts, {
                href: href
            })
        }else{
            delete opts.src
            return  genericTag('script', '', opts, {
                src: href
            });
        }
    }
    //辅助函数
    //判定是开发环境或是测试环境还是线上环境
    function checkProd() {
        return $.config.env === 'production';
    }

    function checkFile(  href ) {
        if (checkProd() ) {
            href += ( /\?/.test(href) ? "&" : "?" ) + "_time=" + Date.now();
        }
        return href;
    }

    function genericTag(name, inner, params, override) {
        return '<' + name + htmlTagParams(params, override) + '>' + inner + '</' + name + '>';
    }

    function genericTagSelfclosing(name, params, override) {
        return '<' + name + htmlTagParams(params, override) + ' />';
    }

    function htmlTagParams(params, override) {
        var maybe_params = '';
        $.mix(params, override, false);
        for (var key in params) {
            if (params[key] != void 0) {
                maybe_params += ' ' + key + '="' + params[key].toString().replace(/&/g, '&amp;').replace(/"/g, '&quot;') + '"';
            }
        }
        return maybe_params;
    };
    return helpers
})

//function make(){
//
//  var data = {};
//  var helper = {
//     setTitle : function(title){
//       data.title = title;
//     }
//  }
//     return [data, helper]
//  }
// var array = make()
// array[1].setTitle("xxx")
// console.log(array[0])
// array2 = make()
// console.log(array2[0])
//nodeで空いているポートを見つける http://d.hatena.ne.jp/sugyan/20110403/1301769822
// node-flowless http://d.hatena.ne.jp/koichik/20120304
/*
 *
function quote(s) {
  (s+='').replace(/\\/g, '\\\\');
  var use = +(s.match(quote.q[1][0]) === null);
  return quote.q[0][use] + s.replace(quote.q[1][1-use], '\\$1') + quote.q[0][use];
}
quote.q=[ ['"', "'"], [/(')/g, /(")/g] ];

 */

//ecma 时代的类系统
//https://github.com/Benvie/Node.js-Ultra-REPL/blob/master/lib/utility/object-utils.js
//https://github.com/Benvie/Node.js-Ultra-REPL/blob/master/lib/utility/explorePath.js