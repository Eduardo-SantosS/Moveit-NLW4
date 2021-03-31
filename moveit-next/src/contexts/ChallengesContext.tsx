import {createContext, useState, ReactNode, useEffect} from 'react';
import Cookies from 'js-cookie';
import challenges from '../../challenges.json';
import { LevelUpModal } from '../components/LevelUpModal';

interface Challenge {
    type: 'body' | 'eye';
    description: string;
    amount: number;

}

interface ChallengeContextData {
    level : number; 
    challengesCompleted: number;
    currentXp: number;
    xpToNextLevel: number;
    activeChallenge: Challenge;
    levelUp: () => void;
    startNewChallenge: () => void;
    resetChallenge : () => void;
    completeChallenge : () => void;
    closeLevelUpModal : () => void;
}

interface ChallangesProviderProps {
    children: ReactNode;
    level: number
    currentXp: number;
    challengesCompleted: number;
}


export const ChallengesContext = createContext({} as ChallengeContextData);

export function ChallengesProvider ({ children, ...rest } : ChallangesProviderProps){
    const [level, setLevel] = useState(rest.level ?? 1);
    const [currentXp, setCurrentXp] = useState(rest.currentXp ?? 0);
    const [challengesCompleted, setChallengesCompleted] = useState(rest.challengesCompleted ?? 0);
    const [activeChallenge, setActiveChallenge] = useState(null);
    const [isLevelUpModalOpen, setIsLevelUpModalOpen] = useState(false);

    const xpToNextLevel = Math.pow((level + 1) * 4, 2)

    useEffect(() => {
        Notification.requestPermission();
    }, []);
    
    useEffect(() => {
        Cookies.set('level', String(level));
        Cookies.set('currentXp', String(currentXp));
        Cookies.set('challengesCompleted', String(challengesCompleted));
    }, [level, currentXp, challengesCompleted]);

    function levelUp(){
        setLevel(level + 1);
        setIsLevelUpModalOpen(true);
    }

    function closeLevelUpModal(){
        setIsLevelUpModalOpen(false);
    }

    function startNewChallenge(){
        const randomChallengeIndex = Math.floor(Math.random() * challenges.length)
        const challenge = challenges[randomChallengeIndex];

        setActiveChallenge(challenge);

        // new Audio('/notification.mp3').play();

        if (Notification.permission === 'granted'){
            new Notification('Novo desafio!', {
                body: `Valendo ${challenge.amount}xp!`
            })
        }
    }

    function resetChallenge(){
        setActiveChallenge(null);
    }

    function completeChallenge(){
        if(! activeChallenge){
            return;
        }

        const {amount} = activeChallenge;

        let finalXp = currentXp + amount;

        if (finalXp >= xpToNextLevel) {
            finalXp -= xpToNextLevel;
            levelUp();
        }

        setCurrentXp(finalXp);
        setActiveChallenge(null);
        setChallengesCompleted(challengesCompleted + 1);
    }

    return (
        <ChallengesContext.Provider 
            value={{
                level, 
                challengesCompleted, 
                currentXp,
                activeChallenge,
                xpToNextLevel, 
                levelUp,
                startNewChallenge,
                resetChallenge,
                completeChallenge,
                closeLevelUpModal,
            }}
        >
            {children}

            {isLevelUpModalOpen && <LevelUpModal />}
        </ChallengesContext.Provider>
    );
}