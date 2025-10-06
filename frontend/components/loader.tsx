import {motion} from "framer-motion"
export default function Loader(){
    return(
        <div className="absolute inset-0 bg-white/90 backdrop-blur-sm z-50 flex flex-col items-center justify-center rounded-lg">
            <motion.img
                src="/animation/loader_new.gif"
                alt="loader animation"
                initial={{ opacity: 0, scale: 0.1 }}
                animate={{ opacity: 1, scale: 0.4, speed : 300 }}
            />    
            <p className="mt-4 text-gray-600 font-semibold">Fetching calories...</p>
        </div>
    )
}