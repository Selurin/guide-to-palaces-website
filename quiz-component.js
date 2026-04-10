class QuizComponent extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });

        this.quiz = null;
        this.questions = [];
        this.results = [];
        this._initialized = false;
    }

    static get observedAttributes() {
        return ['src', 'data'];
    }

    connectedCallback() {
        // Приоритет: сначала src (fetch), потом data (inline JSON)
        const src = this.getAttribute('src');
        if (src) {
            this._loadFromUrl(src);
            return;
        }

        const dataAttr = this.getAttribute('data');
        if (dataAttr && !this._initialized) {
            this._processData(dataAttr);
        }
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (newValue && newValue !== oldValue) {
            if (name === 'src') {
                this._loadFromUrl(newValue);
            } else if (name === 'data') {
                this._processData(newValue);
            }
        }
    }

    _loadFromUrl(url) {
        fetch(url)
            .then(res => {
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                return res.json();
            })
            .then(data => this._initFromObject(data))
            .catch(err => console.error('Ошибка загрузки теста:', err));
    }

    _processData(jsonString) {
        try {
            const parsed = JSON.parse(jsonString);
            this._initFromObject(parsed);
        } catch (e) {
            console.error('Ошибка парсинга данных теста:', e);
        }
    }

    _initFromObject(parsed) {
        this.questions = parsed.questions || [];
        this.results = parsed.results || [];
        this._init();
    }

    _init() {
        this.quiz = {
            score: 0,
            result: 0,
            current: 0,
            questions: this.questions.map(q => new Question(q.text, q.answers)),
            results: this.results.map(r => new Result(r.text, r.value)),
            type: 1
        };

        this._render();
        this._update();
        this._initialized = true;
    }

    _render() {
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                    width: 100%;
                    font-family: helvetica, arial, sans-serif;
                }

                .wrapper {
                    width: 100%;
                    min-height: 100vh;
                    display: flex;
                    align-items: center; 
                    justify-content: center;
                }

                .main {
                    width: 720px;
                    max-width: 90vw;
                    background: #fff;
                    border-radius: 16px;
                    box-shadow: 0 0 20px rgba(0, 0, 0, 0.15);
                    padding: 40px;
                    position: relative;
                }

                .quiz__head {
                    font-size: 24px;
                    margin-bottom: 30px;
                    line-height: 1.4;
                }

                .head__content {
                    padding: 5px;
                    text-align: center;
                    font-size: 28px;

                }

                .score-display {
                    margin-top: 20px;
                    padding: 15px 30px;
                    text-align: center;
                    font-size: 32px;
                    font-weight: bold;
                    color: #000;
                }

                @keyframes fadeIn {
                    from {
                        opacity: 0;
                        transform: translateY(-10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                .quiz__body {
                    margin: 10px 0;
                }

                .buttons__content {
                    display: flex;
                    flex-direction: column;
                    gap: 10px;
                }

                .quiz__footer {
                    margin-top: 20px;
                    text-align: center;
                    font-size: 18px;
                }

                .footer__content {
                    padding: 5px;
                    font-size: 18px;
                    color: #666;
                }

                .button {
                    border: 0;
                    border-radius: 10px;
                    background: #6477EB;
                    color: #fff;
                    padding: 16px 25px;
                    width: 100%;
                    font-size: 17px;
                    cursor: pointer;
                    transition: background 0.3s, transform 0.1s;
                }

                .button:hover {
                    background: #5566d4;
                }

                .button:active {
                    transform: scale(0.98);
                }

                .button_wrong {
                    background: #EB6465;
                }

                .button_wrong:hover {
                    background: #d45556;
                }

                .button_correct {
                    background: #5EB97D;
                }

                .button_correct:hover {
                    background: #4da86c;
                }

                .button_passive {
                    background: #B3B3B3;
                    cursor: default;
                }

                .button_passive:hover {
                    background: #B3B3B3;
                }

                .button_restart {
                    background: #6477EB;
                    margin-top: 20px;
                }

                .button_restart:hover {
                    background: #5566d4;
                }
            </style>

            <div class="wrapper">
                <main class="main">
                    <div class="quiz__head">
                        <div class="head__content" id="head"></div>
                        <div class="score-display" id="score" style="display: none;"></div>
                    </div>
                    <div class="quiz__body">
                        <div class="buttons">
                            <div class="buttons__content" id="buttons"></div>
                        </div>
                    </div>
                    <div class="quiz__footer">
                        <div class="footer__content" id="pages"></div>
                    </div>
                </main>
            </div>
        `;
    }

    _update() {
        const headElem = this.shadowRoot.getElementById("head");
        const buttonsElem = this.shadowRoot.getElementById("buttons");
        const pagesElem = this.shadowRoot.getElementById("pages");
        const scoreElem = this.shadowRoot.getElementById("score");

        if (this.quiz.current < this.quiz.questions.length) {
            headElem.innerHTML = this.quiz.questions[this.quiz.current].text;
            buttonsElem.innerHTML = "";
            scoreElem.style.display = "none";

            for (let i = 0; i < this.quiz.questions[this.quiz.current].answers.length; i++) {
                const btn = document.createElement("button");
                btn.className = "button";
                btn.innerHTML = this.quiz.questions[this.quiz.current].answers[i].text;
                btn.setAttribute("index", i);
                buttonsElem.appendChild(btn);
            }

            pagesElem.innerHTML = (this.quiz.current + 1) + " / " + this.quiz.questions.length;
            this._initButtons();
        } else {
            buttonsElem.innerHTML = "";
            headElem.innerHTML = this.quiz.results[this.quiz.result].text;
            scoreElem.style.display = "block";
            scoreElem.innerHTML = "Очки: " + this.quiz.score + " / " + this.quiz.questions.length;
            
            if (this.quiz.score >= 9) {
                scoreElem.style.color = "#22c55e";
            } else if (this.quiz.score >= 7) {
                scoreElem.style.color = "#a3e635";
            } else if (this.quiz.score >= 5) {
                scoreElem.style.color = "#eab308";
            } else if (this.quiz.score >= 3) {
                scoreElem.style.color = "#f97316";
            } else {
                scoreElem.style.color = "#ef4444";
            }
            
            pagesElem.innerHTML = "";

            const restartBtn = document.createElement("button");
            restartBtn.className = "button button_restart";
            restartBtn.innerHTML = "Пройти заново";
            restartBtn.addEventListener("click", () => this.restart());
            buttonsElem.appendChild(restartBtn);
        }
    }

    _initButtons() {
        const btns = this.shadowRoot.querySelectorAll(".button");
        btns.forEach(btn => {
            btn.addEventListener("click", (e) => {
                this._handleClick(parseInt(e.target.getAttribute("index")));
            });
        });
    }

    _handleClick(index) {
        const correct = this._click(index);
        const btns = this.shadowRoot.querySelectorAll(".button");

        btns.forEach(b => {
            b.className = "button button_passive";
        });

        if (this.quiz.type === 1) {
            if (correct >= 0) {
                btns[correct].className = "button button_correct";
            }
            if (index !== correct) {
                btns[index].className = "button button_wrong";
            }
        } else {
            btns[index].className = "button button_correct";
        }

        setTimeout(() => this._update(), 1000);
    }

    _click(index) {
        const value = this.quiz.questions[this.quiz.current].click(index);
        this.quiz.score += value;

        let correct = -1;

        if (value >= 1) {
            correct = index;
        } else {
            for (let i = 0; i < this.quiz.questions[this.quiz.current].answers.length; i++) {
                if (this.quiz.questions[this.quiz.current].answers[i].value >= 1) {
                    correct = i;
                    break;
                }
            }
        }

        this._next();
        return correct;
    }

    _next() {
        this.quiz.current++;
        if (this.quiz.current >= this.quiz.questions.length) {
            this._end();
        }
    }

    _end() {
        for (let i = 0; i < this.quiz.results.length; i++) {
            if (this.quiz.results[i].check(this.quiz.score)) {
                this.quiz.result = i;
            }
        }
    }

    restart() {
        this.quiz.score = 0;
        this.quiz.result = 0;
        this.quiz.current = 0;
        this._update();
    }
}

class Question {
    constructor(text, answers) {
        this.text = text;
        this.answers = answers.map(a => new Answer(a.text, a.value));
    }

    click(index) {
        return this.answers[index].value;
    }
}

class Answer {
    constructor(text, value) {
        this.text = text;
        this.value = value;
    }
}

class Result {
    constructor(text, value) {
        this.text = text;
        this.value = value;
    }

    check(value) {
        return this.value <= value;
    }
}

customElements.define('quiz-component', QuizComponent);
