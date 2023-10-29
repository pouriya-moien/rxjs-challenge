import { Observable, catchError, fromEvent, map, of, switchMap } from "rxjs";
import { ajax } from 'rxjs/ajax';
import { fromFetch } from 'rxjs/fetch';

import { doctors } from "./models/doctors";
import { article } from "./models/article";



const menu: Element = document.querySelector('#menu-btn');
const navbar: Element = document.querySelector('.navbar');
const boxContainer: Element = document.querySelector('.article-box')
const doctorContainer = document.querySelector('.doctorContainer')





const menuEvent$: Observable<Event> = fromEvent((menu) as Element, 'click')

menuEvent$.subscribe((): void => {
    menu.classList.toggle('fa-times');
    navbar.classList.toggle('active');
})


const scrollEvent$: Observable<Event> = fromEvent(window, 'scroll')

scrollEvent$.subscribe((): void => {
    menu.classList.remove('fa-times');
    navbar.classList.remove('active');
})



const data$ = fromFetch('https://jsonplaceholder.typicode.com/todos?_limit=4').pipe(
    switchMap(response => {
        if (response.ok) {
            return response.json();
        } else {
            return of({ error: true, message: `Error ${response.status}` });
        }
    }),
    catchError(err => {
        console.error(err);
        return of({ error: true, message: err.message })
    })
);

const doctorData$ = fromFetch('http://localhost:3000/dcotors').pipe(
    switchMap(response => {
        if (response.ok) {
            return response.json();
        } else {
            return of({ error: true, message: `Error ${response.status}` });
        }
    }),
    catchError(err => {
        console.error(err);
        return of({ error: true, message: err.message })
    })
);

doctorData$.subscribe({
    next: (result: doctors[]) => {
        result.map((res: doctors) => {
            doctorContainer?.insertAdjacentHTML('beforeend',
                `
            <div class="box">
            <img src="${res.img}" class="doctor-img" alt="">
            <h3> ${res.name}</h3>
            <span>${res.exppert}</span>
            <div class="share">
              <a href="#" class="fab fa-facebook-f"></a>
              <a href="#" class="fab fa-twitter"></a>
              <a href="#" class="fab fa-instagram"></a>
              <a href="#" class="fab fa-linkedin"></a>
            </div>
          </div>
            `)
        })
    }
})

data$.subscribe({
    next: (result: article[]) => {
        result.map((res: article) => {
         if(res) {
            boxContainer.insertAdjacentHTML('beforeend', `
            <div class="box">
                <div class="image">
                <img src="${res.img}" alt="">
                </div>
                <div class="content">
                <div class="icon">
                    <a href="#"> <i class="fas fa-calendar"></i> 1st may, 2021 </a>
                    <a href="#"> <i class="fas fa-user"></i> ادمین ${res.id}</a>
                </div>
                <h3>تایتل مقاله</h3>
                <p>لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ، و با استفاده از طراحان گرافیک است</p>
                <a href="#" class="btn"> بیشتر بدانید <span class="fas fa-chevron-left"></span> </a>
                </div>
            </div>
            `)
         }
        })
    },
    complete: () => console.log('done')
});




