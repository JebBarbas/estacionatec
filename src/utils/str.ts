export default function str(param: string | string[] | undefined){
    if(typeof param === 'undefined') return ''
    if(Array.isArray(param)) return param.join('/')
    return param
}