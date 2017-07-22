var utils = {
    extend: function() {
        var options, name, src, copy, copyIsArray, clone,
            target = arguments[0] || {},
            i = 1,
            length = arguments.length,
            deep = false;
        //如果第一个值为bool值，那么就将第二个参数作为目标参数，同时目标参数从2开始计数
        if ( typeof target === "boolean" ) {
            deep = target;
            target = arguments[1] || {};
            // skip the boolean and the target
            i = 2;
        }
        // 当目标参数不是object 或者不是函数的时候，设置成object类型的
        if ( typeof target !== "object" && !jQuery.isFunction(target) ) {
            target = {};
        }
        //如果extend只有一个函数的时候，那么将跳出后面的操作
        if ( length === i ) {
            target = this;
            --i;
        }
        for ( ; i < length; i++ ) {
            // 仅处理不是 null/undefined values
            if ( (options = arguments[ i ]) != null ) {
                // 扩展options对象
                for ( name in options ) {
                    src = target[ name ];
                    copy = options[ name ];
                    // 如果目标对象和要拷贝的对象是恒相等的话，那就执行下一个循环。
                    if ( target === copy ) {
                        continue;
                    }
                    // 如果我们拷贝的对象是一个对象或者数组的话
                    if ( deep && copy && ( jQuery.isPlainObject(copy) || (copyIsArray = jQuery.isArray(copy)) ) ) {
                        if ( copyIsArray ) {
                            copyIsArray = false;
                            clone = src && jQuery.isArray(src) ? src : [];
                        } else {
                            clone = src && jQuery.isPlainObject(src) ? src : {};
                        }
                        //不删除目标对象，将目标对象和原对象重新拷贝一份出来。 
                        target[ name ] = jQuery.extend( deep, clone, copy );
                    // 如果options[name]的不为空，那么将拷贝到目标对象上去。
                    } else if ( copy !== undefined ) {
                        target[ name ] = copy;
                    }
                }
            }
        }
        // 返回修改的目标对象
        return target;
    } ,
    randomColor:function(){
        //設置制定的顏色，防止有些顏色可見度不高
        var colors = ["#000000","#FF0000","#00FF00","#0000FF","#FFFF00","#FF00FF","#C0C0C0"],
            len = colors.length,
            seal = Math.round(Math.random() * len) ,
            index =  seal >= len ? seal - 1 : seal;    
        return colors[index];
    }

}