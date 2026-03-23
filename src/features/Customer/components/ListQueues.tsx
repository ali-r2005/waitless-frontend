"use client";
import customerApi from "../services/customer.api";
import { useEffect, useState } from "react";
import Link from "next/link";


export default function ListQueues() {
    const [queues, setQueues] = useState([]);

    useEffect(() => {
        customerApi.getQueues().then((data) => {
            console.log(data);
            setQueues(data.data);
        });
    }, []);

    return (
        <div>
            <h1>List Queues</h1>
            <ul>
                {queues.map((queue: any, index: number) => (
                    <li key={index}><Link href={`/customer/queue/${queue.id}?queueName=${queue.name}`}>{queue.name}</Link></li>
                ))}
            </ul>
        </div>
    );
}