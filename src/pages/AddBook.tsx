import { useState, useEffect, useRef, FormEvent } from "react";

import "../styles/books-style.css";

import { useNavigate } from "react-router";

import { url } from "../env/apiUrl.environment";

const AddBook = () => {
    //storing all data in object in useState()
    const [data, setData] = useState({
        title: "",
        author: "",
        category: "",
        ISBN: "",
        createdAt: "",
        editedAt: "",
        activated: true,
    })

    const nav = useNavigate();

    const btnRef = useRef<HTMLButtonElement>(null);

    const months: { [key: number]: string } = {
        0: "January",
        1: "February",
        2: "March",
        3: "April",
        4: "May",
        5: "June",
        6: "July",
        7: "August",
        8: "September",
        9: "October",
        10: "November",
        11: "December"
    };

    //Function to check if the form is okay, if no - disable button to prevent errors
    useEffect(() => {
        if(btnRef.current) {
            if((data.ISBN.length < 10 || data.ISBN.length > 13) || data.title == "" || data.author == "" || data.category == "") {
                btnRef.current.disabled = true;
            } else btnRef.current.disabled = false;
        }
    }, [data.title, data.author, data.category, data.ISBN])

    //Getting time as it is required
    const getCorrectDate = (): string => {
        const date = new Date();

        const day = date.getDate();
        const month = months[date.getMonth()];
        const year = date.getFullYear();
        const time = date.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
        });

        const createdAtString = `${day} ${month} ${year} ${time}`;

        return createdAtString;
    }

    const postNewBook = async (e:FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        //not using setData({ ... }) bc createdAt was empty, it was like queued
        const updatedData = { ...data, createdAt: getCorrectDate() }; 

        const res = await fetch(url, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(updatedData)
        })

        return res.json().then(() => nav("/"));
    }

    return (
        <section className="flex flex-col items-center gap-6 pt-28">
            <h1 className="text-center text-2xl uppercase font-semibold">Add New Book</h1>

            <form
            onSubmit={(e) => postNewBook(e)}
            className="flex flex-col items-center justify-center gap-2">
                <div>
                    <input type="text" id="title" placeholder=" " required
                    onChange={(e) => setData({ ...data, title: e.target.value })} />
                    
                    <label htmlFor="title">Title</label>
                </div>
                <div>
                    <input type="text" id="author" placeholder=" " required 
                    onChange={(e) => setData({ ...data, author: e.target.value })}/>

                    <label htmlFor="author">Author</label>
                </div>
                <div>
                    <input type="text" id="category" placeholder=" " required 
                    onChange={(e) => setData({ ...data, category: e.target.value })} />

                    <label htmlFor="category">Category</label>
                </div>
                <div>
                <input type="text" id="ISBN" placeholder=" " required min={10} max={13} 
                        onChange={(e) => setData({ ...data, ISBN: e.target.value })} />

                    <label htmlFor="ISBN">ISBN</label>
                </div>

                <button ref={btnRef} className="px-5 py-2 bg-[#2ecc71] hover:bg-[#27ae60] duration-[250ms] rounded-md" type="submit">Submit</button>
            </form>
        </section>
    )
}

export default AddBook;