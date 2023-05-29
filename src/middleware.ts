import { jwtVerify } from "jose";
import { NextResponse, NextMiddleware } from "next/server";

export const middleware: NextMiddleware = async (request) => {    
    const jwt = request.cookies.get('loginToken')
    const path = request.nextUrl.pathname

    // Siempre permite salir de la sesión e ir al playground
    if(path.startsWith('/auth/logout') || path.startsWith('/playground')){
        return NextResponse.next()
    }

    // El usuario no tiene iniciada sesión
    if(typeof jwt === 'undefined'){
        // Redirigir a login
        if(!(path.startsWith('/auth/login') || path.startsWith('/auth/register'))){
            return NextResponse.redirect(new URL('/auth/login', request.url))
        }
    }
    // El usuario tiene iniciada sesión
    else{
        try{
            await jwtVerify(jwt.value, new TextEncoder().encode(process.env.JWT_SECRET ?? 'secret'))
            // Redirigir a inicio
            if(path.startsWith('/auth/login') || path.startsWith('/auth/register')){
                return NextResponse.redirect(new URL('/', request.url))
            }
        }
        // O no la tiene ???
        catch(err){
            console.log(err)
            return NextResponse.redirect(new URL('/auth/logout', request.url))
        }
    }

    return NextResponse.next()
}

export const config = {
    matcher: [
      /*
       * Match all request paths except for the ones starting with:
       * - api (API routes)
       * - _next/static (static files)
       * - _next/image (image optimization files)
       * - favicon.ico (favicon file)
       */
      '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
};