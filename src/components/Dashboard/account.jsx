import React, { useEffect, useState } from 'react'
import { Switch } from "@/components/ui/switch"
import { useTheme } from '../theme-provider'

export default function Account() {
    const theme = useTheme();
    const [isDark, setIsDark] = useState(localStorage.getItem("vite-ui-theme") ?? "light");

    useEffect(() => {
        theme.setTheme(isDark? "dark": "light");
    }, [theme, isDark]);
  return (
    <div className='bg-card flex-1 rounded-xl p-2 items-center'>
        <div className='flex flex-row gap-x-4'>
            <p className='text-sm'>Use Dark Theme</p>
            <Switch checked={isDark} onCheckedChange={setIsDark} />
        </div>
    </div>
  )
}
