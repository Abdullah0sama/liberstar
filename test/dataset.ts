import { BookInterfaceFull } from "../src/components/books/bookInterface"
import { ReviewInterfaceFull } from "../src/components/reviews/reviewInterface"
import { UserInterfaceFull } from "../src/components/users/userInterface"

export const booksDataSet:  BookInterfaceFull[] = [
    {
        id: 1,
        description: "Something there",
        title: "Desert",
        image: "https://image.com",
        release_date: '2001-12-22',
    },
    {
        id: 2,
        description: "Something desc",
        title: "Kafka on the shore",
        image: "https://image.com",
        release_date: '2000-11-11',
    }
] 

export const reviewsDataSet: ReviewInterfaceFull[] = [
    {
        id: 1,
        title: 'Wonderful book',
        body: 'long sentance about how good is this book',
        book_ref: 1,
        user_ref: 1,
    },
    {
        id: 2,
        title: 'Not a Wonderful book',
        body: 'long sentance about how bad is this book',
        book_ref: 1,
        user_ref: 2,
    }
]

export const usersDataSet: UserInterfaceFull[] = [
    {
        id: 1,
        name: 'User 1',
        username: 'username1',
        bio: 'Some description',
        dob: '2021-12-11',
    },
    {
        id:2,
        name: 'User 2',
        username: 'username2',
        bio: 'Some description',
        dob: '2012-12-12',
    }
]
