import { userRoles } from "../src/components/auth/auth.interface"
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
        author: 'non'
    },
    {
        id: 2,
        description: "Something desc",
        title: "Kafka on the shore",
        image: "https://image.com",
        release_date: '2000-11-11',
        author: 'haruki murakami'
    },
    {
        id: 3,
        description: "nothing to see here",
        title: "Harry Potter",
        image: "https://image.com",
        release_date: '2000-11-11',
        author: 'JK rowling'
    },
    {
        id: 4,
        description: "Twists",
        title: "Game of thrones",
        image: "https://image.com",
        release_date: '2000-11-11',
        author: 'G R R'
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
    },
    {
        id: 3,
        title: 'Hated it',
        body: 'long sentance about how good is this book',
        book_ref: 2,
        user_ref: 2,
    },
    {
        id: 4,
        title: 'Loving it',
        body: 'long sentance about how bad is this book',
        book_ref: 2,
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
        email: 'email@gmail.com',
        password: '12345678910',
        role: userRoles.user
    },
    {
        id:2,
        name: 'User 2',
        username: 'username2',
        bio: 'Some description',
        dob: '2012-12-12',
        email: 'test@test.com',
        password: '12345678910',
        role: userRoles.user
    },
    {
        id:3,
        name: 'User 3',
        username: 'username3',
        bio: 'Some description',
        dob: '2012-12-12',
        email: 'user@test.com',
        password: '12345678910',
        role: userRoles.user
    },
    {
        id:4,
        name: 'User 4',
        username: 'username4',
        bio: 'Some description',
        dob: '2012-12-12',
        email: 'user@user.com',
        password: '12345678910',
        role: userRoles.user
    },
    {
        id:5,
        name: 'User 4',
        username: 'admin123',
        bio: 'Some description',
        dob: '2012-12-12',
        email: 'admin123@user.com',
        password: '12345678910',
        role: userRoles.admin
    }
]
