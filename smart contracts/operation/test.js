let mylist = [{"age":"1"}, {"age":"2"}]
mylist = mylist.reduce(function(acc, obj){
    let key = obj["age"];
    if(!acc[key]){
        acc[key] = [];
    }
    acc[key].push(obj);
    return acc
}, {})

console.log(mylist)