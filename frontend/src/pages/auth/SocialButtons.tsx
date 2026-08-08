import { Mail, Globe, MessageCircle, Link as LinkIcon } from "lucide-react"

export function SocialButtons() {
  return (
    <div className="flex flex-col items-center gap-3 mt-6">
      <p className="text-sm text-gray-500">Or sign in with social platforms</p>
      <div className="flex gap-3">
        <button className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50">
          <Globe className="w-4 h-4 text-red-500" />
        </button>
        <button className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50">
          <MessageCircle className="w-4 h-4 text-blue-600" />
        </button>
        <button className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50">
          <Mail className="w-4 h-4 text-sky-500" />
        </button>
        <button className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50">
          <LinkIcon className="w-4 h-4 text-blue-700" />
        </button>
      </div>
    </div>
  )
}
