import { useState, useEffect } from "react";

import { Link } from "react-router";

//Api url:
import { url } from "../env/apiUrl.environment";

import "../styles/dashboard-style.css";
import { bookModel } from "../models/book.model";

//Icons:
import editIcon from "../assets/icons/edit.svg";
import deleteIcon from "../assets/icons/delete.svg";
import actionsIcon from "../assets/icons/actions.svg";

const Dashboard = () => {
    //to store book's data
    const [data, setData] = useState<bookModel[] | null>([]);
    const [showData, setShowData] = useState<bookModel[] | null>([]);

    //to get month name having its number 0-indexed
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

    
    //fetching data from db
    const fetchData = async () => {
        const fetchedData = await fetch(url);

        fetchedData.json().then((res) => {
            setData(res);
        });
    }

    useEffect(() => {
        fetchData();
        filterData("Show Active", data);
    }, [data?.length]);

    //function to filter data
    const filterData = (filter: string, source: bookModel[] | null) => {
        if(!source) return;

        let result:bookModel[] = [];

        switch(filter) {
            case "Show All": {
                result = source;
                break;
            } 

            case "Show Active": {
                result = source.filter(el => el.activated);
                break;
            }

            case "Show Deactivated": {
                result = source.filter(el => !el.activated);
                break;
            }
        }

        setShowData(result);
    }

    //Functions to delete or deactivate/re-activate the book
    const deleteBook = async (id: string) => {
        await fetch(url + id, {
            method: "DELETE",
            headers: {"Content-Type": "application/json"},
        })
    }

    const handleBook = async (el: bookModel) => {
        el.activated = !el.activated;

        const date = new Date();

        const day = date.getDate();
        const month = months[date.getMonth()];
        const year = date.getFullYear();
        const time = date.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
        });

        const editedAtString = `${day} ${month} ${year} ${time}`;

        el.editedAt = editedAtString;

        await fetch(url + el.id, {
            method: "PUT",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(el)
        }).then((res) => {
            fetchData();
        })
    }

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text);
    }

    return (
        <section className="py-24 overflow-x-hidden flex flex-col items-end gap-8">
                <select
                className="text-black"
                onChange={(e) => filterData(e.target.value, data)} >
                    <option value="Show All" className="text-black">Show All</option>
                    <option value="Show Active" className="text-black" selected={true}>Show Active</option>
                    <option value="Show Deactivated" className="text-black">Show Deactivated</option>
                </select>

                <table className="book-table">
                    <thead>
                        <tr>
                            <th>Book Title</th>
                            <th>Author</th>
                            <th>Category</th>
                            <th>ISBN</th>
                            <th>Created At</th>
                            <th>Edited At</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {showData?.map((el: bookModel) => (
                            <tr key={el.id}>
                                <td onClick={() => handleCopy(el.title)}>{el.title}</td>
                                <td onClick={() => handleCopy(el.author)}>{el.author}</td>
                                <td onClick={() => handleCopy(el.category)}>{el.category}</td>
                                <td onClick={() => handleCopy(el.ISBN)}>{el.ISBN}</td>
                                <td>{el.createdAt}</td>
                                <td>{el.editedAt}</td>
                                <td className="flex items-center justify-center gap-6 relative">
                                    <div className="flex flex-col gap-4">
                                        <Link to={`/books/edit/${el.id}`}><button className="border-8 border-cyan-50 hover:bg-[#16a085]">Edit <img src={editIcon} alt="" data-type="icon" /></button></Link>
                                        <button onClick={() => handleBook(el)} className="border-8 border-[#3498db] hover:bg-[#2980b9]">{el.activated ? "Deactivate" : "Re-activate"}</button>
                                        <button onClick={() => deleteBook(el.id)} className="border-8 border-[#e74c3c] hover:bg-[#c0392b]">Delete <img src={deleteIcon} alt="" data-type="icon" /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
        </section>
    )
}

export default Dashboard;