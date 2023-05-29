export default function groupArray<T, K extends string | number | symbol>(array:T[], predicate:(element: T, index?: number, array?: T[]) => K){
    const groups:Record<K, T[]> = {} as Record<K, T[]>
    array.forEach((value, index, _array) => {
        const key = predicate(value, index, _array)

        if(groups[key]){
            groups[key].push(value)
        }
        else{
            groups[key] = [value]
        }
    })

    return groups
}