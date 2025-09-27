export function exhaustiveGuard (_value: never){
    throw Error (`Error here is ${JSON.stringify(_value)}`)
}