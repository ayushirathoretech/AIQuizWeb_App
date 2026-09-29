"use strict";


// ============================================================
// SOCKET CONNECTION
// ============================================================

const socket = io();


// ============================================================
// APPLICATION STATE
// ============================================================

let currentRoomCode = "";
let currentPlayerName = "";
let isHost = false;

let currentQuestion = null;

let timerInterval = null;
let questionDeadline = null;

let lastPersonalResults = [];
let lastLeaderboard = [];


// ============================================================
// SCREEN ELEMENTS
// ============================================================

const homeScreen =
    document.getElementById("homeScreen");

const createScreen =
    document.getElementById("createScreen");

const joinScreen =
    document.getElementById("joinScreen");

const lobbyScreen =
    document.getElementById("lobbyScreen");

const gameScreen =
    document.getElementById("gameScreen");

const resultsScreen =
    document.getElementById("resultsScreen");


// ============================================================
// HOME / NAVIGATION BUTTONS
// ============================================================

const showCreateBtn =
    document.getElementById("showCreateBtn");

const showJoinBtn =
    document.getElementById("showJoinBtn");

const backFromCreateBtn =
    document.getElementById("backFromCreateBtn");

const backFromJoinBtn =
    document.getElementById("backFromJoinBtn");


// ============================================================
// LOBBY / GAME BUTTONS
// ============================================================

const startQuizBtn =
    document.getElementById("startQuizBtn");

const leaveLobbyBtn =
    document.getElementById("leaveLobbyBtn");

const leaveGameBtn =
    document.getElementById("leaveGameBtn");

const playAgainBtn =
    document.getElementById("playAgainBtn");

const backHomeBtn =
    document.getElementById("backHomeBtn");


// ============================================================
// CREATE FORM
// ============================================================

const createQuizForm =
    document.getElementById("createQuizForm");

const quizTitle =
    document.getElementById("quizTitle");

const quizTopic =
    document.getElementById("quizTopic");

const quizImage =
    document.getElementById("quizImage");

const quizPdf =
    document.getElementById("quizPdf");

const questionCount =
    document.getElementById("questionCount");

const questionTime =
    document.getElementById("questionTime");

const difficulty =
    document.getElementById("difficulty");

const multiplayer =
    document.getElementById("multiplayer");

const createQuizBtn =
    document.getElementById("createQuizBtn");

const createError =
    document.getElementById("createError");

// ============================================================
// ATTACHMENT BUTTON
// ============================================================

const attachmentBtn =
    document.getElementById("attachmentBtn");

const attachmentMenu =
    document.getElementById("attachmentMenu");

const addImageBtn =
    document.getElementById("addImageBtn");

const addPdfBtn =
    document.getElementById("addPdfBtn");

const composerAttachments =
    document.getElementById("composerAttachments");


// ============================================================
// OPEN / CLOSE ATTACHMENT MENU
// ============================================================

if (attachmentBtn && attachmentMenu) {

    attachmentBtn.addEventListener(
        "click",
        function(event) {

            event.preventDefault();
            event.stopPropagation();

            const isHidden =
                attachmentMenu.classList.contains("hidden");

            if (isHidden) {

                attachmentMenu.classList.remove(
                    "hidden"
                );

                attachmentBtn.setAttribute(
                    "aria-expanded",
                    "true"
                );

            } else {

                attachmentMenu.classList.add(
                    "hidden"
                );

                attachmentBtn.setAttribute(
                    "aria-expanded",
                    "false"
                );

            }

        }
    );

}


// ============================================================
// ADD IMAGE
// ============================================================

if (addImageBtn && quizImage && attachmentMenu) {

    addImageBtn.addEventListener(
        "click",
        function(event) {

            event.preventDefault();
            event.stopPropagation();

            attachmentMenu.classList.add(
                "hidden"
            );

            if (attachmentBtn) {

                attachmentBtn.setAttribute(
                    "aria-expanded",
                    "false"
                );

            }

            quizImage.click();

        }
    );

}


// ============================================================
// ADD PDF
// ============================================================

if (addPdfBtn && quizPdf && attachmentMenu) {

    addPdfBtn.addEventListener(
        "click",
        function(event) {

            event.preventDefault();
            event.stopPropagation();

            attachmentMenu.classList.add(
                "hidden"
            );

            if (attachmentBtn) {

                attachmentBtn.setAttribute(
                    "aria-expanded",
                    "false"
                );

            }

            quizPdf.click();

        }
    );

}


// ============================================================
// CLOSE MENU WHEN CLICKING OUTSIDE
// ============================================================

document.addEventListener(
    "click",
    function(event) {

        if (
            attachmentMenu
            && attachmentBtn
            && !attachmentMenu.contains(event.target)
            && !attachmentBtn.contains(event.target)
        ) {

            attachmentMenu.classList.add(
                "hidden"
            );

            attachmentBtn.setAttribute(
                "aria-expanded",
                "false"
            );

        }

    }
);
// ============================================================
// JOIN FORM
// ============================================================

const joinForm =
    document.getElementById("joinForm");

const joinInviteLink =
    document.getElementById("joinInviteLink");

const joinRoomCode =
    document.getElementById("joinRoomCode");

const playerName =
    document.getElementById("playerName");

const joinError =
    document.getElementById("joinError");


// ============================================================
// LOBBY ELEMENTS
// ============================================================

const lobbyTitle =
    document.getElementById("lobbyTitle");

const roomCodeDisplay =
    document.getElementById("roomCodeDisplay");

const inviteLink =
    document.getElementById("inviteLink");

const copyInviteLinkBtn =
    document.getElementById("copyInviteLinkBtn");

const qrCodeImage =
    document.getElementById("qrCodeImage");

const playersList =
    document.getElementById("playersList");

const playerCount =
    document.getElementById("playerCount");

const hostControls =
    document.getElementById("hostControls");

const waitingMessage =
    document.getElementById("waitingMessage");


// ============================================================
// GAME ELEMENTS
// ============================================================

const questionNumber =
    document.getElementById("questionNumber");

const totalQuestions =
    document.getElementById("totalQuestions");

const questionText =
    document.getElementById("questionText");

const optionsContainer =
    document.getElementById("optionsContainer");

const timer =
    document.getElementById("timer");

const answerMessage =
    document.getElementById("answerMessage");


// ============================================================
// RESULT ELEMENTS
// ============================================================

const myResult =
    document.getElementById("myResult");

const leaderboard =
    document.getElementById("leaderboard");

const personalResults =
    document.getElementById("personalResults");


// ============================================================
// GLOBAL MESSAGE
// ============================================================

const globalMessage =
    document.getElementById("globalMessage");


// ============================================================
// SCREEN MANAGEMENT
// ============================================================

function showScreen(screen) {

    const screens = [
        homeScreen,
        createScreen,
        joinScreen,
        lobbyScreen,
        gameScreen,
        resultsScreen
    ];

    screens.forEach(
        currentScreen => {

            if (currentScreen) {

                currentScreen.classList.remove(
                    "active"
                );

            }

        }
    );


    if (screen) {

        screen.classList.add(
            "active"
        );

    }

}


// ============================================================
// ERROR HELPERS
// ============================================================

function showError(
    element,
    message
) {

    if (!element) {
        return;
    }

    element.textContent =
        message;

    element.classList.remove(
        "hidden"
    );

}


function hideError(
    element
) {

    if (!element) {
        return;
    }

    element.textContent =
        "";

    element.classList.add(
        "hidden"
    );

}


// ============================================================
// GLOBAL MESSAGE
// ============================================================

function showGlobalMessage(
    message
) {

    if (!globalMessage) {
        return;
    }

    globalMessage.textContent =
        message;

    globalMessage.classList.remove(
        "hidden"
    );

    clearTimeout(
        showGlobalMessage.timeout
    );

    showGlobalMessage.timeout =
        setTimeout(
            function() {

                globalMessage.classList.add(
                    "hidden"
                );

            },
            3500
        );

}


// ============================================================
// FORMAT TIME
// ============================================================

function formatTime(
    seconds
) {

    seconds =
        Number(seconds);


    if (
        !Number.isFinite(seconds)
    ) {

        return "0.00s";

    }


    if (seconds < 60) {

        return (
            seconds.toFixed(2)
            + "s"
        );

    }


    const minutes =
        Math.floor(
            seconds / 60
        );


    const remaining =
        seconds % 60;


    return (
        minutes
        + ":"
        + remaining
            .toFixed(2)
            .padStart(
                5,
                "0"
            )
    );

}


// ============================================================
// HTML ESCAPE
// ============================================================

function escapeHtml(
    value
) {

    const div =
        document.createElement(
            "div"
        );

    div.textContent =
        String(
            value ?? ""
        );

    return div.innerHTML;

}


// ============================================================
// INVITE LINK
// ============================================================

function generateInviteLink(
    roomCode
) {

    if (!roomCode) {

        return "";

    }


    return (
        window.location.origin
        + "/?join="
        + encodeURIComponent(
            roomCode
        )
    );

}


// ============================================================
// UPDATE INVITE LINK
// ============================================================

function updateInviteLink(
    roomCode
) {

    if (!inviteLink) {
        return;
    }

    inviteLink.value =
        generateInviteLink(
            roomCode
        );

}
// ============================================================
// COPY ROOM CODE
// ============================================================

const copyCodeBtn =
    document.getElementById("copyCodeBtn");


if (copyCodeBtn) {

    copyCodeBtn.addEventListener(
        "click",
        async function() {

            if (!currentRoomCode) {
                return;
            }

            try {

                await navigator.clipboard.writeText(
                    currentRoomCode
                );

                // Change icon to check mark
                const originalIcon =
                    copyCodeBtn.innerHTML;

                copyCodeBtn.innerHTML = `
                    <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    >
                        <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                `;

                copyCodeBtn.title =
                    "Copied!";


                setTimeout(
                    function() {

                        copyCodeBtn.innerHTML =
                            originalIcon;

                        copyCodeBtn.title =
                            "Copy room code";

                    },
                    1500
                );

            } catch (error) {

                console.error(
                    "Failed to copy room code:",
                    error
                );

                showGlobalMessage(
                    "Could not copy the room code."
                );

            }

        }
    );

}


// ============================================================
// COPY INVITE LINK
// ============================================================

if (copyInviteLinkBtn) {

    copyInviteLinkBtn.addEventListener(
        "click",
        async function() {

            if (
                !inviteLink
                || !inviteLink.value
            ) {

                return;

            }


            try {

                if (
                    navigator.clipboard
                ) {

                    await navigator.clipboard.writeText(
                        inviteLink.value
                    );

                } else {

                    const temp =
                        document.createElement(
                            "textarea"
                        );

                    temp.value =
                        inviteLink.value;

                    document.body.appendChild(
                        temp
                    );

                    temp.select();

                    document.execCommand(
                        "copy"
                    );

                    temp.remove();

                }


                const oldText =
                    copyInviteLinkBtn.textContent;


                copyInviteLinkBtn.textContent =
                    "Copied!";


                setTimeout(
                    function() {

                        copyInviteLinkBtn.textContent =
                            oldText;

                    },
                    1500
                );


            } catch (error) {

                console.error(
                    "Copy invite link failed:",
                    error
                );

                showGlobalMessage(
                    "Could not copy the invite link."
                );

            }

        }
    );

}


// ============================================================
// CREATE QUIZ
// ============================================================

if (createQuizForm) {

    createQuizForm.addEventListener(
        "submit",
        async function(event) {

            event.preventDefault();


            hideError(
                createError
            );


            const topic =
                quizTopic.value.trim();


            const imageFile =
                quizImage.files[0];


            const pdfFile =
                quizPdf.files[0];


            // ------------------------------------------------
            // Validate source
            // ------------------------------------------------

            if (
                !topic
                && !imageFile
                && !pdfFile
            ) {

                showError(
                    createError,
                    "Enter a topic/notes or upload an image/PDF."
                );

                return;

            }


            // ------------------------------------------------
            // Validate question count
            // ------------------------------------------------

            const count =
                Number(
                    questionCount.value
                );


            if (
                !Number.isInteger(count)
                || count < 1
                || count > 50
            ) {

                showError(
                    createError,
                    "Questions must be between 1 and 50."
                );

                return;

            }


            // ------------------------------------------------
            // Validate time
            // ------------------------------------------------

            const timePerQuestion =
                Number(
                    questionTime.value
                );


            if (
                !Number.isInteger(
                    timePerQuestion
                )
                || timePerQuestion < 5
                || timePerQuestion > 300
            ) {

                showError(
                    createError,
                    "Time must be between 5 and 300 seconds."
                );

                return;

            }


            // ------------------------------------------------
            // Build FormData
            // ------------------------------------------------

            const formData =
                new FormData();


            formData.append(
                "title",
                quizTitle.value.trim()
                || "AI Quiz"
            );


            formData.append(
                "topic",
                topic
            );


            formData.append(
                "question_count",
                String(count)
            );


            formData.append(
                "question_time",
                String(
                    timePerQuestion
                )
            );


            formData.append(
                "difficulty",
                difficulty.value
            );


            formData.append(
                "multiplayer",
                multiplayer.checked
                    ? "true"
                    : "false"
            );


            if (imageFile) {

                formData.append(
                    "source_image",
                    imageFile
                );

            }


            if (pdfFile) {

                formData.append(
                    "source_pdf",
                    pdfFile
                );

            }


            // ------------------------------------------------
            // Loading state
            // ------------------------------------------------

            createQuizBtn.disabled =
                true;


            createQuizBtn.textContent =
                "Generating Quiz...";


            try {

                const response =
                    await fetch(
                        "/create-room",
                        {
                            method: "POST",
                            body: formData
                        }
                    );


                let data;


                try {

                    data =
                        await response.json();

                } catch {

                    throw new Error(
                        "Server returned an invalid response."
                    );

                }


                if (
                    !response.ok
                    || !data.success
                ) {

                    throw new Error(
                        data.message
                        || "Unable to create quiz."
                    );

                }


                // ------------------------------------------------
                // Store room
                // ------------------------------------------------

                const room =
                    data.room;


                currentRoomCode =
                    room.room_code;


                currentPlayerName =
                    "Host";


                isHost =
                    true;


                roomCodeDisplay.textContent =
                    room.room_code;


                lobbyTitle.textContent =
                    room.quiz_title
                    || "Quiz Lobby";


                if (
                    room.qr_code
                ) {

                    qrCodeImage.src =
                        room.qr_code;

                    qrCodeImage.alt =
                        `QR code for room ${room.room_code}`;

                }


                updateInviteLink(
                    room.room_code
                );


                // ------------------------------------------------
                // Join as host
                // ------------------------------------------------

                socket.emit(
                    "join_room",
                    {
                        room_code:
                            currentRoomCode,

                        player_name:
                            currentPlayerName
                    }
                );


            } catch (error) {

                console.error(
                    "CREATE QUIZ ERROR:",
                    error
                );


                showError(
                    createError,
                    error.message
                    || "Unable to create quiz."
                );


            } finally {

                createQuizBtn.disabled =
                    false;


                createQuizBtn.textContent =
                    "Create Quiz";

            }

        }
    );

}


// ============================================================
// JOIN QUIZ
//
// Supports:
// 1. Invite link
// 2. Room code
// ============================================================

if (joinForm) {

    joinForm.addEventListener(
        "submit",
        function(event) {

            event.preventDefault();


            hideError(
                joinError
            );


            const inviteValue =
                joinInviteLink
                    ? joinInviteLink.value.trim()
                    : "";


            const roomCodeValue =
                joinRoomCode
                    ? joinRoomCode.value
                        .trim()
                        .toUpperCase()
                    : "";


            const name =
                playerName.value.trim();


            // ------------------------------------------------
            // Player name
            // ------------------------------------------------

            if (!name) {

                showError(
                    joinError,
                    "Please enter your name."
                );

                playerName.focus();

                return;

            }


            if (name.length > 30) {

                showError(
                    joinError,
                    "Name cannot exceed 30 characters."
                );

                playerName.focus();

                return;

            }


            // ------------------------------------------------
            // Determine room code
            // ------------------------------------------------

            let roomCode =
                "";


            // Invite link has priority
            if (inviteValue) {

                try {

                    const url =
                        new URL(
                            inviteValue,
                            window.location.origin
                        );


                    roomCode =
                        (
                            url.searchParams.get(
                                "join"
                            )
                            || ""
                        )
                        .trim()
                        .toUpperCase();


                } catch (error) {

                    // Maybe user entered the room code
                    // into the invite field.

                    roomCode =
                        inviteValue
                            .trim()
                            .toUpperCase();

                }

            }


            // If no valid code came from invite link,
            // use room-code field.

            if (
                !/^[A-Z0-9]{6}$/.test(
                    roomCode
                )
            ) {

                roomCode =
                    roomCodeValue;

            }


            // ------------------------------------------------
            // Validate room code
            // ------------------------------------------------

            if (
                !/^[A-Z0-9]{6}$/.test(
                    roomCode
                )
            ) {

                showError(
                    joinError,
                    "Enter a valid 6-character room code or invite link."
                );

                return;

            }


            // ------------------------------------------------
            // Save player information
            // ------------------------------------------------

            currentRoomCode =
                roomCode;


            currentPlayerName =
                name;


            isHost =
                false;


            // ------------------------------------------------
            // Join Socket.IO room
            // ------------------------------------------------

            socket.emit(
                "join_room",
                {
                    room_code:
                        roomCode,

                    player_name:
                        name
                }
            );

        }
    );

}


// ============================================================
// IMAGE PREVIEW
// ============================================================

if (quizImage) {

    quizImage.addEventListener(
        "change",
        function() {

            const preview =
                document.getElementById(
                    "imagePreview"
                );


            if (!preview) {
                return;
            }


            preview.innerHTML =
                "";


            preview.classList.add(
                "hidden"
            );


            const file =
                quizImage.files[0];


            if (!file) {
                return;
            }


            if (
                file.size
                > 5 * 1024 * 1024
            ) {

                showError(
                    createError,
                    "Image must be 5 MB or smaller."
                );

                quizImage.value =
                    "";

                return;

            }


            const reader =
                new FileReader();


            reader.onload =
                function(event) {

                    const image =
                        document.createElement(
                            "img"
                        );


                    image.src =
                        event.target.result;


                    image.alt =
                        "Selected quiz source image";


                    image.className =
                        "source-preview-image";


                    preview.appendChild(
                        image
                    );


                    preview.classList.remove(
                        "hidden"
                    );

                };


            reader.readAsDataURL(
                file
            );

        }
    );

}


// ============================================================
// PDF PREVIEW
// ============================================================

if (quizPdf) {

    quizPdf.addEventListener(
        "change",
        function() {

            const preview =
                document.getElementById(
                    "pdfPreview"
                );


            if (!preview) {
                return;
            }


            preview.innerHTML =
                "";


            preview.classList.add(
                "hidden"
            );


            const file =
                quizPdf.files[0];


            if (!file) {
                return;
            }


            if (
                file.size
                > 10 * 1024 * 1024
            ) {

                showError(
                    createError,
                    "PDF must be 10 MB or smaller."
                );

                quizPdf.value =
                    "";

                return;

            }


            const info =
                document.createElement(
                    "div"
                );


            info.textContent =
                `Selected PDF: ${file.name}`;


            info.className =
                "selected-file";


            preview.appendChild(
                info
            );


            preview.classList.remove(
                "hidden"
            );

        }
    );

}


// ============================================================
// HOME → CREATE QUIZ
// ============================================================

if (showCreateBtn) {

    showCreateBtn.addEventListener(
        "click",
        function(event) {

            event.preventDefault();


            hideError(
                createError
            );


            showScreen(
                createScreen
            );


            if (quizTopic) {

                quizTopic.focus();

            }

        }
    );

}


// ============================================================
// HOME → JOIN QUIZ
// ============================================================

if (showJoinBtn) {

    showJoinBtn.addEventListener(
        "click",
        function(event) {

            event.preventDefault();


            hideError(
                joinError
            );


            showScreen(
                joinScreen
            );


            if (joinInviteLink) {

                joinInviteLink.focus();

            }

        }
    );

}


// ============================================================
// CREATE → HOME
// ============================================================

if (backFromCreateBtn) {

    backFromCreateBtn.addEventListener(
        "click",
        function() {

            showScreen(
                homeScreen
            );

        }
    );

}


// ============================================================
// JOIN → HOME
// ============================================================

if (backFromJoinBtn) {

    backFromJoinBtn.addEventListener(
        "click",
        function() {

            showScreen(
                homeScreen
            );

        }
    );

}


// ============================================================
// SOCKET: JOIN SUCCESS
// ============================================================

socket.on(
    "join_success",
    function(data) {

        currentRoomCode =
            data.room_code;


        currentPlayerName =
            data.name;


        isHost =
            Boolean(
                data.is_host
            );


        lobbyTitle.textContent =
            data.quiz_title
            || "Quiz Lobby";


        roomCodeDisplay.textContent =
            data.room_code;


        if (
            data.qr_code
        ) {

            qrCodeImage.src =
                data.qr_code;

        }


        updateInviteLink(
            data.room_code
        );


        updateHostControls();


        showScreen(
            lobbyScreen
        );

    }
);


// ============================================================
// SOCKET: PLAYERS UPDATED
// ============================================================

socket.on(
    "players_updated",
    function(data) {

        const players =
            data.players
            || [];


        playersList.innerHTML =
            "";


        playerCount.textContent =
            players.length;


        // ------------------------------------------------
        // Find current player
        // ------------------------------------------------

        const me =
            players.find(
                player =>
                    player.name
                    === currentPlayerName
            );


        if (me) {

            isHost =
                Boolean(
                    me.is_host
                );

        }


        // ------------------------------------------------
        // Render players
        // ------------------------------------------------

        players.forEach(
            player => {

                const item =
                    document.createElement(
                        "li"
                    );


                item.className =
                    "player-item";


                const name =
                    document.createElement(
                        "span"
                    );


                name.textContent =
                    player.name;


                item.appendChild(
                    name
                );


                if (
                    player.is_host
                ) {

                    const hostTag =
                        document.createElement(
                            "span"
                        );


                    hostTag.textContent =
                        "HOST";


                    hostTag.className =
                        "host-tag";


                    item.appendChild(
                        hostTag
                    );

                }


                if (
                    player.name
                    === currentPlayerName
                ) {

                    const youTag =
                        document.createElement(
                            "span"
                        );


                    youTag.textContent =
                        "YOU";


                    youTag.className =
                        "you-tag";


                    item.appendChild(
                        youTag
                    );

                }


                playersList.appendChild(
                    item
                );

            }
        );


        updateHostControls();

    }
);


// ============================================================
// HOST CONTROLS
// ============================================================

function updateHostControls() {

    if (
        !hostControls
        || !waitingMessage
    ) {

        return;

    }


    if (isHost) {

        hostControls.classList.remove(
            "hidden"
        );


        waitingMessage.classList.add(
            "hidden"
        );


    } else {

        hostControls.classList.add(
            "hidden"
        );


        waitingMessage.classList.remove(
            "hidden"
        );

    }

}


// ============================================================
// START QUIZ
// ============================================================

if (startQuizBtn) {

    startQuizBtn.addEventListener(
        "click",
        function() {

            if (!currentRoomCode) {

                showGlobalMessage(
                    "Room code is missing."
                );

                return;

            }


            if (!isHost) {

                showGlobalMessage(
                    "Only the host can start the quiz."
                );

                return;

            }


            socket.emit(
                "start_quiz",
                {
                    room_code:
                        currentRoomCode
                }
            );

        }
    );

}


// ============================================================
// QUESTION STARTED
// ============================================================

socket.on(
    "question_started",
    function(data) {

        currentQuestion =
            data;


        questionNumber.textContent =
            data.question_number;


        totalQuestions.textContent =
            data.total_questions;


        questionText.textContent =
            data.question;


        answerMessage.textContent =
            "";


        answerMessage.className =
            "answer-message";


        renderOptions(
            data.options
        );


        questionDeadline =
            Number(
                data.deadline_at
            ) * 1000;


        startTimer();


        showScreen(
            gameScreen
        );

    }
);


// ============================================================
// RENDER ANSWER OPTIONS
// ============================================================

function renderOptions(
    options
) {

    optionsContainer.innerHTML =
        "";


    const labels = [
        "A",
        "B",
        "C",
        "D"
    ];


    if (!Array.isArray(options)) {

        return;

    }


    options.forEach(
        function(option, index) {

            const button =
                document.createElement(
                    "button"
                );


            button.type =
                "button";


            button.className =
                "answer-option";


            button.dataset.index =
                index;


            const label =
                document.createElement(
                    "span"
                );


            label.className =
                "option-label";


            label.textContent =
                labels[index]
                || String(
                    index + 1
                );


            const text =
                document.createElement(
                    "span"
                );


            text.className =
                "option-text";


            text.textContent =
                option;


            button.appendChild(
                label
            );


            button.appendChild(
                text
            );


            button.addEventListener(
                "click",
                function() {

                    submitAnswer(
                        index
                    );

                }
            );


            optionsContainer.appendChild(
                button
            );

        }
    );

}


// ============================================================
// TIMER
// ============================================================

function startTimer() {

    stopTimer();


    updateTimer();


    timerInterval =
        setInterval(
            updateTimer,
            50
        );

}


function updateTimer() {

    if (!questionDeadline) {

        timer.textContent =
            "0.0";

        return;

    }


    const remaining =
        Math.max(
            0,
            (
                questionDeadline
                - Date.now()
            ) / 1000
        );


    timer.textContent =
        remaining.toFixed(1);


    if (
        remaining <= 5
    ) {

        timer.classList.add(
            "danger"
        );

    } else {

        timer.classList.remove(
            "danger"
        );

    }


    if (
        remaining <= 0
    ) {

        stopTimer();

        disableAnswerButtons();

    }

}


function stopTimer() {

    if (
        timerInterval !== null
    ) {

        clearInterval(
            timerInterval
        );


        timerInterval =
            null;

    }

}


// ============================================================
// SUBMIT ANSWER
// ============================================================

function submitAnswer(
    answerIndex
) {

    if (!currentRoomCode) {
        return;
    }


    disableAnswerButtons();


    socket.emit(
        "submit_answer",
        {
            room_code:
                currentRoomCode,

            player_name:
                currentPlayerName,

            answer_index:
                answerIndex
        }
    );

}


// ============================================================
// DISABLE ANSWERS
// ============================================================

function disableAnswerButtons() {

    const buttons =
        optionsContainer.querySelectorAll(
            ".answer-option"
        );


    buttons.forEach(
        button => {

            button.disabled =
                true;

        }
    );

}


// ============================================================
// SOCKET: ANSWER RECEIVED
// ============================================================

socket.on(
    "answer_received",
    function(data) {

        stopTimer();


        const buttons =
            optionsContainer.querySelectorAll(
                ".answer-option"
            );


        buttons.forEach(
            button => {

                const index =
                    Number(
                        button.dataset.index
                    );


                if (
                    index
                    === data.correct_answer
                ) {

                    button.classList.add(
                        "correct"
                    );

                }


                if (
                    index
                    === data.selected_answer
                    && !data.correct
                ) {

                    button.classList.add(
                        "wrong"
                    );

                }

            }
        );


        if (
            data.correct
        ) {

            answerMessage.textContent =
                `Correct! Time: ${formatTime(data.time)}`;


            answerMessage.classList.add(
                "correct-message"
            );


        } else {

            answerMessage.textContent =
                `Wrong answer. Time: ${formatTime(data.time)}`;


            answerMessage.classList.add(
                "wrong-message"
            );

        }

    }
);


// ============================================================
// SOCKET: ANSWER ERROR
// ============================================================

socket.on(
    "answer_error",
    function(data) {

        showGlobalMessage(
            data.message
            || "Answer error."
        );


        if (
            data.message
            && data.message
                .toLowerCase()
                .includes("time")
        ) {

            stopTimer();

            disableAnswerButtons();

        }

    }
);


// ============================================================
// SOCKET: QUESTION TIMEOUT
// ============================================================

socket.on(
    "question_timeout",
    function() {

        stopTimer();


        disableAnswerButtons();


        if (
            !answerMessage.textContent
        ) {

            answerMessage.textContent =
                "Time is up!";


            answerMessage.classList.add(
                "wrong-message"
            );

        }

    }
);


// ============================================================
// SOCKET: ROOM ERROR
// ============================================================

socket.on(
    "room_error",
    function(data) {

        const message =
            data.message
            || "Room error.";


        if (
            joinScreen.classList.contains(
                "active"
            )
        ) {

            showError(
                joinError,
                message
            );

            return;

        }


        if (
            createScreen.classList.contains(
                "active"
            )
        ) {

            showError(
                createError,
                message
            );

            return;

        }


        showGlobalMessage(
            message
        );

    }
);


// ============================================================
// SOCKET: GAME FINISHED
// ============================================================

socket.on(
    "game_finished",
    function(data) {

        stopTimer();


        lastLeaderboard =
            data.leaderboard
            || [];


        lastPersonalResults =
            data.personal_results
            || [];


        renderMyResult(
            data.my_result
        );


        renderLeaderboard(
            lastLeaderboard
        );


        renderPersonalResults(
            lastPersonalResults
        );


        showScreen(
            resultsScreen
        );

    }
);


// ============================================================
// MY RESULT
// ============================================================

function renderMyResult(
    result
) {

    if (!result) {

        myResult.innerHTML =
            "";

        return;

    }


    myResult.innerHTML = `
        <div class="result-stat">
            <span>Player</span>
            <strong>${escapeHtml(result.name)}</strong>
        </div>

        <div class="result-stat">
            <span>Rank</span>
            <strong>#${result.rank ?? "-"}</strong>
        </div>

        <div class="result-stat">
            <span>Score</span>
            <strong>${result.score}</strong>
        </div>

        <div class="result-stat">
            <span>Total Time</span>
            <strong>${formatTime(result.total_time)}</strong>
        </div>
    `;

}


// ============================================================
// LEADERBOARD
// ============================================================

function renderLeaderboard(
    players
) {

    leaderboard.innerHTML =
        "";


    if (!players.length) {

        leaderboard.textContent =
            "No results available.";

        return;

    }


    const table =
        document.createElement(
            "table"
        );


    table.className =
        "leaderboard-table";


    table.innerHTML = `
        <thead>
            <tr>
                <th>Rank</th>
                <th>Player</th>
                <th>Score</th>
                <th>Total Time</th>
            </tr>
        </thead>

        <tbody></tbody>
    `;


    const tbody =
        table.querySelector(
            "tbody"
        );


    players.forEach(
        player => {

            const row =
                document.createElement(
                    "tr"
                );


            if (
                player.name
                === currentPlayerName
            ) {

                row.classList.add(
                    "current-player"
                );

            }


            row.innerHTML = `
                <td>#${player.rank}</td>
                <td>${escapeHtml(player.name)}</td>
                <td>${player.score}</td>
                <td>${formatTime(player.total_time)}</td>
            `;


            tbody.appendChild(
                row
            );

        }
    );


    leaderboard.appendChild(
        table
    );

}


// ============================================================
// PERSONAL RESULTS
// ============================================================

function renderPersonalResults(
    results
) {

    personalResults.innerHTML =
        "";


    if (!results.length) {

        personalResults.textContent =
            "No answer history available.";

        return;

    }


    results.forEach(
        result => {

            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "review-card";


            const heading =
                document.createElement(
                    "h4"
                );


            heading.textContent =
                `Question ${result.question_number}`;


            card.appendChild(
                heading
            );


            const question =
                document.createElement(
                    "p"
                );


            question.className =
                "review-question";


            question.textContent =
                result.question;


            card.appendChild(
                question
            );


            const options =
                document.createElement(
                    "div"
                );


            options.className =
                "review-options";


            if (
                Array.isArray(
                    result.options
                )
            ) {

                result.options.forEach(
                    (
                        option,
                        index
                    ) => {

                        const optionElement =
                            document.createElement(
                                "div"
                            );


                        optionElement.className =
                            "review-option";


                        if (
                            index
                            === result.correct_answer
                        ) {

                            optionElement.classList.add(
                                "review-correct"
                            );

                        }


                        if (
                            index
                            === result.selected_answer
                            && index
                            !== result.correct_answer
                        ) {

                            optionElement.classList.add(
                                "review-wrong"
                            );

                        }


                        const label =
                            document.createElement(
                                "span"
                            );


                        label.textContent =
                            `${String.fromCharCode(65 + index)}. `;


                        const text =
                            document.createElement(
                                "span"
                            );


                        text.textContent =
                            option;


                        optionElement.appendChild(
                            label
                        );


                        optionElement.appendChild(
                            text
                        );


                        options.appendChild(
                            optionElement
                        );

                    }
                );

            }


            card.appendChild(
                options
            );


            const status =
                document.createElement(
                    "div"
                );


            status.className =
                "review-status";


            if (
                result.timed_out
            ) {

                status.textContent =
                    `Time out • ${formatTime(result.time)}`;


                status.classList.add(
                    "review-timeout"
                );


            } else if (
                result.correct
            ) {

                status.textContent =
                    `Correct • ${formatTime(result.time)}`;


                status.classList.add(
                    "review-correct-text"
                );


            } else {

                status.textContent =
                    `Wrong • ${formatTime(result.time)}`;


                status.classList.add(
                    "review-wrong-text"
                );

            }


            card.appendChild(
                status
            );


            personalResults.appendChild(
                card
            );

        }
    );

}


// ============================================================
// PLAY AGAIN
// ============================================================

if (playAgainBtn) {

    playAgainBtn.addEventListener(
        "click",
        function() {

            if (!isHost) {

                showGlobalMessage(
                    "Only the host can start another game."
                );

                return;

            }


            socket.emit(
                "start_quiz",
                {
                    room_code:
                        currentRoomCode
                }
            );

        }
    );

}


// ============================================================
// LEAVE CURRENT ROOM
// ============================================================

function leaveCurrentRoom() {

    if (!currentRoomCode) {

        return;

    }


    socket.emit(
        "leave_room",
        {
            room_code:
                currentRoomCode,

            player_name:
                currentPlayerName
        }
    );


    stopTimer();


    currentRoomCode =
        "";


    currentPlayerName =
        "";


    isHost =
        false;


    currentQuestion =
        null;


    questionDeadline =
        null;

}


// ============================================================
// LEAVE LOBBY
// ============================================================

if (leaveLobbyBtn) {

    leaveLobbyBtn.addEventListener(
        "click",
        function() {

            leaveCurrentRoom();


            showScreen(
                homeScreen
            );

        }
    );

}


// ============================================================
// BACK HOME
// ============================================================

if (backHomeBtn) {

    backHomeBtn.addEventListener(
        "click",
        function() {

            leaveCurrentRoom();


            showScreen(
                homeScreen
            );

        }
    );

}


// ============================================================
// LEAVE QUIZ MODAL
// ============================================================

function openLeaveQuizModal() {

    if (
        document.getElementById(
            "leaveQuizModal"
        )
    ) {

        return;

    }


    const modal =
        document.createElement(
            "div"
        );


    modal.id =
        "leaveQuizModal";


    modal.className =
        "custom-modal-overlay";


    modal.innerHTML = `
        <div
            class="custom-modal"
            role="dialog"
            aria-modal="true"
        >

            <div class="custom-modal-icon">
                !
            </div>

            <h2>
                Leave Quiz?
            </h2>

            <p>
                Your progress in this quiz will be lost.
            </p>

            <div class="custom-modal-buttons">

                <button
                    type="button"
                    class="modal-cancel-btn"
                    id="cancelLeaveQuiz"
                >
                    Stay
                </button>

                <button
                    type="button"
                    class="modal-leave-btn"
                    id="confirmLeaveQuiz"
                >
                    Leave Quiz
                </button>

            </div>

        </div>
    `;


    document.body.appendChild(
        modal
    );


    const cancelButton =
        document.getElementById(
            "cancelLeaveQuiz"
        );


    const confirmButton =
        document.getElementById(
            "confirmLeaveQuiz"
        );


    cancelButton.addEventListener(
        "click",
        function() {

            modal.remove();

        }
    );


    confirmButton.addEventListener(
        "click",
        function() {

            modal.remove();


            leaveCurrentRoom();


            showScreen(
                homeScreen
            );

        }
    );


    modal.addEventListener(
        "click",
        function(event) {

            if (
                event.target === modal
            ) {

                modal.remove();

            }

        }
    );


    function escapeHandler(
        event
    ) {

        if (
            event.key === "Escape"
        ) {

            modal.remove();


            document.removeEventListener(
                "keydown",
                escapeHandler
            );

        }

    }


    document.addEventListener(
        "keydown",
        escapeHandler
    );

}


// ============================================================
// LEAVE GAME BUTTON
// ============================================================

if (leaveGameBtn) {

    leaveGameBtn.addEventListener(
        "click",
        function(event) {

            event.preventDefault();

            event.stopPropagation();


            openLeaveQuizModal();

        }
    );

}


// ============================================================
// SOCKET CONNECTION STATUS
// ============================================================

socket.on(
    "connect",
    function() {

        console.log(
            "Socket connected:",
            socket.id
        );

    }
);


socket.on(
    "disconnect",
    function() {

        console.log(
            "Socket disconnected."
        );

    }
);


// ============================================================
// AUTOMATIC INVITE LINK JOIN
//
// Example:
// http://localhost:5000/?join=ABC123
// ============================================================

function checkAutomaticJoin() {

    const params =
        new URLSearchParams(
            window.location.search
        );


    const room =
        params.get(
            "join"
        );


    if (!room) {

        return;

    }


    const cleanRoom =
        room
            .trim()
            .toUpperCase();


    if (
        !/^[A-Z0-9]{6}$/.test(
            cleanRoom
        )
    ) {

        return;

    }


    // Put the complete current URL
    // into the invite-link field.

    if (joinInviteLink) {

        joinInviteLink.value =
            window.location.href;

    }


    // Also populate room code.

    if (joinRoomCode) {

        joinRoomCode.value =
            cleanRoom;

    }


    showScreen(
        joinScreen
    );


    if (playerName) {

        playerName.focus();

    }

}


// ============================================================
// START AUTOMATIC JOIN CHECK
// ============================================================

checkAutomaticJoin();