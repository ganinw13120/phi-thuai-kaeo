'use client'
import { createRef, RefObject, useEffect, useRef, useState } from "react"
import Image from "@/node_modules/next/image";
import Hand from '../public/hand.png'
import { Avatar, Button, Divider, Input, List, ListItem, ListItemDecorator, Typography } from "@/node_modules/@mui/joy/index";

type Position = {
  x: number
  y: number
}

type Person = {
  name: string
  objRef: any
}

export default function Home() {

  const [names, setNames] = useState<Person[]>([]);
  const [name, setName] = useState<string>("");

  const startRef = useRef<HTMLDivElement>(null)
  const handRef = useRef<HTMLImageElement>(null)

  const [handPosition, setHandPosition] = useState<Position>({
    x: 200,
    y: 200
  })

  const random = () => {

  }

  const calculatePosition = (boxRef: any): Position => {
    const box = (startRef.current! as any).getBoundingClientRect()
    const hand = (handRef.current! as any).getBoundingClientRect()
    return {
      x: (box.x + (box.width / 2)) - (hand.width / 2),
      y: (box.y + (box.height / 2)) - (hand.height / 2),
    }
  }

  useEffect(() => {
    reset()
  }, [startRef.current, names])

  const reset = () => {
    if (!startRef) return
    setHandPosition(calculatePosition(startRef))
  }

  const addName = () => {
    if (!name) return
    const newRef = createRef()
    setNames(prev => {
      let tmp = [...prev]
      tmp.push({
        name: name,
        objRef: newRef
      })
      return tmp
    })
    setName("")
  }

  return (
    <>
      <div className="relative z-0">
        <Image src={Hand} alt="" ref={handRef} className="absolute hand" style={{ transform: `translate(${handPosition.x}px, ${handPosition.y}px)` }} />
      </div>
      <main className="min-h-screen px-20 py-6">
        <div className="m-2 z-1 relative">
          <div className="flex gap-3">
            <Button className="" size="lg" variant="solid" color="primary" onClick={random}>
              Random
            </Button>
            <Button className="" size="lg" variant="outlined" color="primary" onClick={reset}>
              Reset
            </Button>
            <input placeholder="x" onChange={(e) => {
              setHandPosition(prev => {
                return {
                  x: parseFloat(e.target.value),
                  y: prev.y,
                }
              })
            }} />
            <input placeholder="y" onChange={(e) => {
              setHandPosition(prev => {
                return {
                  y: parseFloat(e.target.value),
                  x: prev.x,
                }
              })
            }} />
          </div>
          <div className="flex my-2 gap-3">
            <Typography className="my-auto">Add new person : </Typography>
            <Input variant="soft" placeholder="name..." value={name} onChange={(e: any) => {
              setName(e.target.value)
            }} />
            <Button className="" size="lg" variant="solid" color="primary" onClick={addName}>
              Add
            </Button>
          </div>
          <div className="grid grid-cols-3 my-2">
            {
              names.map(n => {
                return (
                  <div className="flex gap-3 mr-2 my-2 bg-white p-2">
                    <Avatar>{n.name[0]}</Avatar>
                    <Typography className="my-auto">{n.name}</Typography>
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
            names.map((person, k) => {
              return <Cell text={person.name} objRef={person.objRef} key={k} />
            })
          }
        </div>
      </main></>
  )
}


interface CellProps {
  text: string
  objRef: RefObject<HTMLDivElement>
}

const Cell: React.FC<CellProps> = (props: CellProps) => {
  return (
    <div className="cell" ref={props.objRef}>
      {props.text}
    </div>
  )
}