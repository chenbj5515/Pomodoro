import { getRandomOneFromList } from '@/utils'
import { Pause, Play, RotateCcw } from 'lucide-react'

const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`
}

const startBuildAudios = [
    '/audios/start-build.mp3',
    '/audios/start-build-1.mp3',
    '/audios/start-build-2.mp3',
]

export function FocusClock(props: any) {
    const { status, prevStatus, countdown, dispatch } = props;

    const handleReset = () => {
        dispatch({ type: "RESET" })
    }

    function handleClick() {
        if (status === "paused" || status === "initial") {
            dispatch({ type: "START" })
            if (status === "initial") {
                let audioSrc = getRandomOneFromList(startBuildAudios);
                const audio = new Audio(audioSrc);
                audio.play().catch((err) => {
                    console.error('Error playing audio:', err);
                });
            }
        }
        else {
            dispatch({ type: "PAUSE" })
        }
    }

    return (
        <div className="flex min-h-screen w-full items-center justify-center bg-gray-100">
            <div className="relative flex w-full max-w-[20rem] flex-col items-center justify-center">
                <div className="relative aspect-square w-full max-w-md">
                    {/* Outer circle (wall indentation) */}
                    <div className="absolute inset-0 rounded-full bg-gray-100 shadow-[inset_8px_8px_16px_#bebebe,inset_-8px_-8px_16px_#ffffff]">

                        {/* Inner circle (raised clock) */}
                        <div className="absolute inset-[12%] rounded-full bg-gray-100 shadow-[6px_6px_12px_#bebebe,-6px_-6px_12px_#ffffff]">
                            {/* Time display */}
                            <div className="absolute inset-0 flex items-center justify-center text-4xl font-medium font-mono tabular-nums sm:text-5xl md:text-[2.25rem]">
                                {formatTime(countdown)}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-8 flex w-full max-w-xs items-center justify-between">
                    <button
                        onClick={handleReset}
                        className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 shadow-[3px_3px_6px_#bebebe,-3px_-3px_6px_#ffffff] transition-all hover:shadow-[inset_3px_3px_6px_#bebebe,inset_-3px_-3px_6px_#ffffff] sm:h-14 sm:w-14"
                    >
                        <RotateCcw className="h-5 w-5 text-gray-600 sm:h-6 sm:w-6" />
                    </button>

                    <button
                        onClick={handleClick}
                        className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 shadow-[4px_4px_8px_#bebebe,-4px_-4px_8px_#ffffff] transition-all hover:shadow-[inset_4px_4px_8px_#bebebe,inset_-4px_-4px_8px_#ffffff] sm:h-14 sm:w-14"
                    >
                        <div>
                            {status === "paused" || status === "initial" ? (
                                <Play size={24} color='black' fill="black" />
                            ) : (
                                <Pause size={24} color='black' fill="black" />
                            )}
                        </div>
                    </button>
                </div>
            </div>
        </div>
    )
}