'use client'
import { createRef, RefObject, useEffect, useRef, useState } from "react"
import Image from "@/node_modules/next/image";
import Hand from '../public/hand.png'
import { Avatar, Button, Divider, Input, List, ListItem, ListItemDecorator, Typography } from "@/node_modules/@mui/joy/index";
import { Close } from "@/node_modules/@mui/icons-material/index";
type Position = {
  x: number
  y: number
}

type Person = {
  name: string
  objRef: any
}

enum GameState {
  Waiting,
  Selecting,
  Completed,
}

const wait = async (time: number): Promise<void> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve()
    }, time);
  })
}

export default function Home() {

  const [people, setPeople] = useState<Person[]>([]);
  const [name, setName] = useState<string>("");

  const startRef = useRef<HTMLDivElement>(null);
  const handRef = useRef<HTMLImageElement>(null);

  const [game, setGame] = useState<GameState>(GameState.Waiting);

  const [selected, setSelected] = useState<number | null>(null);

  const [handPosition, setHandPosition] = useState<Position>({
    x: 200,
    y: 200
  });

  const random = () => {
    const i = Math.floor(Math.random() * people.length);
    setSelected(i);
    setGame(GameState.Selecting)
    simulateGhost(i)
  }

  const calculatePosition = (boxRef: any): Position => {
    const box = (boxRef.current! as any).getBoundingClientRect()
    const hand = (handRef.current! as any).getBoundingClientRect()
    return {
      x: (box.x + (box.width / 2)) - (hand.width / 2),
      y: (box.y + (box.height / 2)) - (hand.height / 2),
    }
  }

  const randomThenGoto = () => {
    const target = Math.floor(Math.random() * people.length)
    setHandPosition(calculatePosition(people[target].objRef))
  }


  const simulateGhost = async (target: number) => {
    const trickMoveCount = Math.floor(people.length * 0.7)
    randomThenGoto()
    for (let i = 0; i < trickMoveCount; i++) {
      await wait(1000)
      randomThenGoto()
    }
    setHandPosition(calculatePosition(people[target].objRef))
    await wait(4000)
    setGame(GameState.Completed)
  }

  useEffect(() => {
    if (game === GameState.Waiting) {
      reset()
    }
    else if (game === GameState.Completed) {
      setHandPosition(calculatePosition(people[selected!].objRef));
    }
  }, [game, people])

  const reset = () => {
    if (!startRef) return
    setHandPosition(calculatePosition(startRef))
    setGame(GameState.Waiting)
  }

  const addPerson = () => {
    if (!name) return
    const newRef = createRef()
    setPeople(prev => {
      let tmp = [...prev]
      tmp.push({
        name: name,
        objRef: newRef
      })
      return tmp
    })
    setName("")
    setGame(GameState.Waiting)
  }

  const removePerson = (i: number) => {
    setPeople(prev => {
      let tmp = [...prev]
      tmp.splice(i, 1)
      return tmp
    })
    setGame(GameState.Waiting)
  }

  return (
    <>
      <div className="relative z-0">
        <Image src={Hand} alt="" ref={handRef} className="absolute hand" style={{ transform: `translate(${handPosition.x}px, ${handPosition.y}px)` }} />
      </div>
      <main className="min-h-screen px-20 py-6">
        <div className="m-2 z-1 relative">
          <div className="flex gap-3">
            <Button className="" size="lg" variant="solid" color="primary" onClick={random} loading={game === GameState.Selecting}>
              Random
            </Button>
            <Button className="" size="lg" variant="outlined" color="primary" onClick={reset}>
              Reset
            </Button>
          </div>
          <div className="flex my-2 gap-3">
            <Typography className="my-auto">Add new person : </Typography>
            <Input variant="soft" placeholder="name..." value={name} onChange={(e: any) => {
              setName(e.target.value)
            }} />
            <Button className="" size="lg" variant="solid" color="primary" onClick={addPerson}>
              Add
            </Button>
          </div>
          <div className="grid grid-cols-3 my-2">
            {
              people.map((n, k) => {
                return (
                  <div className="flex gap-3 mr-2 my-2 bg-white p-2" key={k}>
                    <Avatar></Avatar>
                    <Typography className="my-auto">{n.name}</Typography>
                    <div className="flex-grow"></div>
                    <Close className="cursor-pointer my-auto" onClick={() => { removePerson(k) }} />
                  </div>
                )
              })
            }
          </div>
        </div>
        <Divider />
        <div className="mt-8 grid grid-cols-4 grid-rows-3">
          <div className="cell col-span-2 font-bold" ref={startRef}>
          </div>
          {
            people.map((person, k) => {
              const isSelected = game === GameState.Completed && k === selected
              return <Cell selected={isSelected} text={person.name} objRef={person.objRef} key={k} />
            })
          }
        </div>
      </main></>
  )
}


interface CellProps {
  text: string
  objRef: RefObject<HTMLDivElement>
  selected: boolean
}

const Cell: React.FC<CellProps> = (props: CellProps) => {
  return (
    <div className={`cell ${props.selected ? "selected" : ""}`} ref={props.objRef}>
      {props.text}
    </div>
  )
}