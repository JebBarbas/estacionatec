import bcrypt from 'bcrypt'

export async function hash(plainText: string){
    const saltRounds = 10
    return bcrypt.hash(plainText, saltRounds)
}

export async function compare(plainText: string, storedPasswordHash: string){
    return bcrypt.compare(plainText, storedPasswordHash)
}