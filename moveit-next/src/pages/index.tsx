import { CompletedChallengs } from "../components/CompletedChallenges";
import { CountDown } from "../components/CountDown";
import { ExperienceBar } from "../components/ExperienceBar";
import { Profile } from "../components/Profile";
import styles from '../styles/pages/Home.module.css';

import Head from 'next/head';
import {GetServerSideProps} from 'next';
import { ChallengeBox } from "../components/ChallengeBox";
import { CountDownProvider } from "../contexts/CountDownContext";
import { ChallengesProvider } from "../contexts/ChallengesContext";

interface HomeProps {
  level: number
  currentXp: number;
  challengesCompleted: number;
}

export default function Home(props : HomeProps) {
  return (
    <ChallengesProvider 
      level={props.level} 
      currentXp= {props.currentXp}
      challengesCompleted={props.challengesCompleted} 
    >
      <div className={styles.container}>
        <Head>
          <title>Início | move.it</title>
        </Head>
        <ExperienceBar />

        <CountDownProvider>
          <section>
            <div>
              <Profile />
              <CompletedChallengs />
              <CountDown />
            </div>
            <div>
              <ChallengeBox />
            </div>
          </section>
        </CountDownProvider>
      </div>
    </ChallengesProvider>
  )
}

export const getServerSideProps: GetServerSideProps =  async (ctx) =>{

  const {level, currentXp, challengesCompleted} = ctx.req.cookies;

  return{
    props: {
      level: Number(level),
      currentXp: Number(currentXp),
      challengesCompleted: Number(challengesCompleted)
    }
  }
}
