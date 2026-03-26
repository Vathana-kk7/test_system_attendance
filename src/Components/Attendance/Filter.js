
export const Filter=({newfilte,select})=>{
    if(!select || select==="All Classes") return newfilte;
    return newfilte.filter((s)=>
        s.courses?.some(c=>String(c.id)===String(select)))
}


// export const Filter=({newfilte,select})=>{
//     if(!select || select==="All Classes") return newfilte;
//     return newfilte.filter((s)=>
//        s.courses?.some(c => String(c.id) === String(select))
//     )
// }