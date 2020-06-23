
+ ans: 0/1

```
db.tasks.insert({
    teacher: "yang hong",
    title: "test contest",
    class: "单项选择",
    totscore: 100,
    tasks: [
        {
            task: "task 1",
            score: 50,
            A: {desc: "A is right", ans: 1},
            B: {desc: "B is right", ans: 0},
            C: {desc: "C is right", ans: 0},
            D: {desc: "D is right", ans: 0}
        },

        {
            task: "task 2",
            socre: 50,
            A: {desc: "A is right", ans: 0},
            B: {desc: "B is right", ans: 1},
            C: {desc: "C is right", ans: 0},
            D: {desc: "D is right", ans: 0}
        }
    ]
})
```
