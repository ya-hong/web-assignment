
+ ans: 0/1

```
db.tasks.insert({
    teacher: "yang hong",
    title: "test contest",
    class: "单项选择",
    tasks: [
        {
            name: "task 1",
            score: 50,
            A: {desc: "A is right", ans: 1},
            B: {desc: "B is right", ans: 0},
            C: {desc: "C is right", ans: 0},
            D: {desc: "D is right", ans: 0}
        },
        {
            name: "task 2",
            score: 50,
            A: {desc: "A is right", ans: 0},
            B: {desc: "B is right", ans: 1},
            C: {desc: "C is right", ans: 0},
            D: {desc: "D is right", ans: 0}
        }
    ]
})
```
