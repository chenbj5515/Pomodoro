'use client'
import { useEffect, useReducer } from 'react';
import { FocusClock } from '../components/focus-clock';
import { ArtworkViewer } from '@/components/artwork-viewer';
import { motion } from "framer-motion";
import { getRandomOneFromList } from '@/utils';

// Define the state type
interface TimerState {
  status: 'initial' | 'focusing' | 'short break' | 'long break' | 'paused';
  prevStatus: 'initial' | 'focusing' | 'short break' | 'long break' | 'paused';
  cycle: number;
  countdown: number;
}

// Define the action types
type TimerAction =
  | { type: 'START' }
  | { type: 'PAUSE' }
  | { type: 'TIMER_END' }
  | { type: 'RESET' }
  | { type: 'TIME_TICK' };

// Initial state
const initialState: TimerState = {
  status: 'initial',
  prevStatus: 'initial',
  cycle: 0,
  countdown: 25 * 60, // 25 minutes in seconds
};

function reducer(state: TimerState, action: TimerAction): TimerState {
  switch (action.type) {
    case 'START':
      if (state.status === 'initial' || state.status === 'paused') {
        return { ...state, prevStatus: state.status, status: 'focusing' };
      }
      return state;

    case 'PAUSE':
      if (state.status === 'focusing' || state.status === 'short break' || state.status === 'long break') {
        return { ...state, prevStatus: state.status, status: 'paused' };
      }
      return state;

    case 'TIMER_END':
      if (state.status === 'focusing') {
        const newCycle = state.cycle + 1;
        if (newCycle < 4) {
          return {
            ...state,
            prevStatus: state.status,
            status: 'short break',
            cycle: newCycle,
            countdown: 5 * 60,
          };
        } else {
          return {
            ...state,
            prevStatus: state.status,
            status: 'long break',
            cycle: 0,
            countdown: 10 * 60,
          };
        }
      } else if (state.status === 'short break' || state.status === 'long break') {
        return { ...state, prevStatus: state.status, status: 'focusing', countdown: 25 * 60 };
      }
      return state;

    case 'RESET':
      if (state.status === "paused") {
        if (state.prevStatus === 'focusing') {
          return { ...state, countdown: 25 * 60 };
        } else if (state.prevStatus === 'short break') {
          return { ...state, countdown: 5 * 60 };
        } else if (state.prevStatus === 'long break') {
          return { ...state, countdown: 10 * 60 };
        }
      }
      if (state.status === 'focusing') {
        return { ...state, countdown: 25 * 60 };
      } else if (state.status === 'short break') {
        return { ...state, countdown: 5 * 60 };
      } else if (state.status === 'long break') {
        return { ...state, countdown: 10 * 60 };
      }
      return state;

    case 'TIME_TICK':
      if (state.countdown > 0 && state.status !== 'paused') {
        return { ...state, prevStatus: state.status, countdown: state.countdown - 1 };
      }
      return state;

    default:
      return state;
  }
}

const shortBreakAudios = [
  '/audios/take-a-rest.mp3',
  '/audios/take-a-rest-1.mp3',
  '/audios/rest-your-eyes.mp3',
]

const longBreakAudios = [
  '/audios/long-break.mp3',
]

const goBackToBuildAudios = [
  '/audios/go-back-to-build.mp3',
]

export default function Component() {
  const [{
    status,
    prevStatus,
    countdown,
  }, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (status === "paused") {
      timer && clearInterval(timer);
      timer = null;
    }
    if (status === "focusing" || status === "short break" || status === "long break") {
      timer = setInterval(() => {
        dispatch({ type: 'TIME_TICK' })
      }, 1000)
    }
    if (countdown === 0) {
      dispatch({ type: "TIMER_END" })
    }
    let audioSrc = ""
    if (status === "focusing" && prevStatus !== "focusing" && prevStatus !== "initial" && prevStatus !== "paused") {
      audioSrc = getRandomOneFromList(goBackToBuildAudios);
    }
    if (status === "short break" && prevStatus !== "short break") {
      audioSrc = getRandomOneFromList(shortBreakAudios);
    }
    if (status === "long break" && prevStatus !== "long break") {
      audioSrc = getRandomOneFromList(longBreakAudios);
    }
    if (audioSrc) {
      const audio = new Audio(audioSrc);
      audio.play().catch((err) => {
        console.error('Error playing audio:', err);
      });
    }
    return () => {
      timer && clearInterval(timer);
      timer = null;
    }
  }, [status, countdown, prevStatus]);

  const showFocus = status === "initial" || status === "focusing" || (status === "paused" && prevStatus === "focusing");

  return (
    <>
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={showFocus ? { opacity: 1, height: "auto" } : { opacity: 0, height: 0 }}
        transition={{ duration: 0.3 }}
      >
        <FocusClock
          status={status}
          countdown={countdown}
          dispatch={dispatch}
        />
      </motion.div>
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={showFocus ? { opacity: 0, height: 0 } : { opacity: 1, height: "auto" }}
        transition={{ duration: 0.3 }}
      >
        <ArtworkViewer
          status={status}
          countdown={countdown}
        />
      </motion.div>
    </>
  )
}