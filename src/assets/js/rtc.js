import h from './helpers.js';

window.addEventListener('load', async () => {
  const room = h.getQString(location.href, 'room');
  let username = sessionStorage.getItem('username');

  if (room) {
    const { data } = await axios.get(`/meet/${room}`);
    if (!data.success) {
      window.location.replace('/notfound');
      return;
    } else {
      document.title = data.room.roomName;
    }
  }

  if (!room) {
    document.querySelectorAll('.tablinks')[0].click();
  } else if (!username) {
    document.querySelectorAll('.tablinks')[1].click();
    let socket = io('/stream');
    socket.on('connect', () => {
      socket.emit('ready', { room, socketId: socket.io.engine.id });
      socket.on('roomStatus', ({ isFull, length }) => {
        if (isFull) {
          document.querySelector('#enter-room').disabled = true;
          document.querySelector(
            '#maximum-error'
          ).innerHTML = `This meeting has reached a maximum of ${length} participants. Please try again later.`;
          document.querySelector('#maximum-error').style.display = 'block';
        }
      });
    });
  } else {
    let commElem = document.getElementsByClassName('room-comm');
    document.querySelector('.control-navbar').classList.add('d-flex');
    document.querySelector('#intro-room').style.display = 'none';

    for (let i = 0; i < commElem.length; i++) {
      commElem[i].attributes.removeNamedItem('hidden');
    }

    var pc = [];
    // socket của client
    // socketio -> client - server
    // socket -> gồm nhiêu hàm để giao tiếp thằng server
    // server -> socket để giao tiếp thằng client
    let socket = io('/stream');

    var socketId = '';
    var myStream = '';
    var screen = '';
    var recordedStream = [];
    var mediaRecorder = '';

    //Get user video by default
    getAndSetUserStream();

    socket.on('connect', () => {
      //set socketId
      socketId = socket.io.engine.id;

      socket.emit('ready', { room, socketId: socket.io.engine.id });

      socket.on('roomStatus', ({ isFull }) => {
        if (isFull) {
          window.location.replace('/meet');
        } else {
          const avatar = document.querySelector('.img-avatar-mail').src;
          const info = {
            socketId,
            username,
            avatar,
          };
          socket.emit('subscribe', {
            room: room,
            socketId: socketId,
            info,
          });
        }
      });

      socket.on('usersInRoom', async (data) => {
        // data sẽ la danh sách người dùng
        // lấy người dùng local ra từ cái mảng người dùng trả về
        const hostUser = JSON.parse(JSON.stringify(data[socketId]));
        // xoá nó khỏi cái mảng người dùng trả về
        delete data[socketId];
        // thêm người dùng local vào lại ở đầu mảng
        const users = Object.values({ socketId: hostUser, ...data });
        // gọi api để kiếm tra xem thử người dùng local có phải chủ phòng hay không
        const isHost = await h.checkIsHost();
        sessionStorage.setItem('users', JSON.stringify(users));

        h.renderUserInRoom(users, socketId, isHost.success, socket);
      });

      socket.on('new user', (data) => {
        socket.emit('newUserStart', {
          to: data.socketId,
          sender: socketId,
          username: username,
        });
        pc.push(data.socketId);
        init(true, data.socketId, data.username);
      });

      socket.on('newUserStart', (data) => {
        pc.push(data.sender);
        init(false, data.sender, data.username);
      });

      socket.on('ice candidates', async (data) => {
        data.candidate
          ? await pc[data.sender].addIceCandidate(
              new RTCIceCandidate(data.candidate)
            )
          : '';
      });

      socket.on('sdp', async (data) => {
        if (data.description.type === 'offer') {
          data.description
            ? await pc[data.sender].setRemoteDescription(
                new RTCSessionDescription(data.description)
              )
            : '';

          h.getUserFullMedia()
            .then(async (stream) => {
              if (!document.getElementById('local').srcObject) {
                h.setLocalStream(stream);
              }

              //save my stream
              myStream = stream;

              stream.getTracks().forEach((track) => {
                pc[data.sender].addTrack(track, stream);
              });

              let answer = await pc[data.sender].createAnswer();

              await pc[data.sender].setLocalDescription(answer);

              socket.emit('sdp', {
                description: pc[data.sender].localDescription,
                to: data.sender,
                sender: socketId,
              });
            })
            .catch((e) => {
              console.error(e);
            });
        } else if (data.description.type === 'answer') {
          await pc[data.sender].setRemoteDescription(
            new RTCSessionDescription(data.description)
          );
        }
      });

      socket.on('chat', (data) => {
        h.addChat(data, 'remote');
      });

      socket.on('newVote', (data) => {
        h.addVote(data, 'remote', room, socket);
      });

      socket.on('submitVote', ({ key, vote }) => {
        console.log('data', key, vote);
        $(`#${key}`).text(vote > 1 ? `(${vote} votes)` : `(${vote} vote)`);
      });

      socket.on('mute', () => {
        let elem = document.getElementById('toggle-mute');
        if (elem.classList.contains('active')) return;
        elem.click();
        document.querySelector('#notificationModalBtn').click();
      });

      socket.on('question', async (data) => {
        if(data.status === 'close') {
          $(`#${data.id}`).remove();
        };
        const isHost = await h.checkIsHost();
        h.renderQuestion(data, room, socket, isHost.success);
      });

      socket.on('userRename', ({ id, newName }) => {
        const selector = `div#${id} > .user-name`;
        document.querySelector(selector).innerHTML = newName;
      });
    });

    function getAndSetUserStream() {
      h.getUserFullMedia()
        .then((stream) => {
          //save my stream
          myStream = stream;

          h.setLocalStream(stream);
        })
        .catch((e) => {
          console.error(`stream error: ${e}`);
        });
    }

    const uploadBtn = document.querySelector('#chat-image');
    uploadBtn.onchange = async (e) => {
      e.preventDefault();
      const formData = new FormData();
      formData.append('file', e.target.files[0]);
      const { data } = await axios.post('/upload-file', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      h.addChat(
        {
          room: room,
          msg: data.file,
          sender: `${username}`,
          type: 'file',
        },
        'local'
      );
      if (data.success) {
        socket.emit('chat', {
          room: room,
          msg: data.file,
          sender: `${username}`,
          type: 'file',
        });
      }
    };

    function sendMsg(msg) {
      let data = {
        room: room,
        msg: msg,
        sender: `${username}`,
        type: 'text',
      };

      //emit chat message
      socket.emit('chat', data);

      //add localchat
      h.addChat(data, 'local');
    }

    function init(createOffer, partnerName, username) {
      pc[partnerName] = new RTCPeerConnection(h.getIceServer());

      if (screen && screen.getTracks().length) {
        screen.getTracks().forEach((track) => {
          pc[partnerName].addTrack(track, screen); //should trigger negotiationneeded event
        });
      } else if (myStream) {
        myStream.getTracks().forEach((track) => {
          pc[partnerName].addTrack(track, myStream); //should trigger negotiationneeded event
        });
      } else {
        h.getUserFullMedia()
          .then((stream) => {
            //save my stream
            myStream = stream;

            stream.getTracks().forEach((track) => {
              pc[partnerName].addTrack(track, stream); //should trigger negotiationneeded event
            });

            h.setLocalStream(stream);
          })
          .catch((e) => {
            console.error(`stream error: ${e}`);
          });
      }

      //create offer
      if (createOffer) {
        pc[partnerName].onnegotiationneeded = async () => {
          let offer = await pc[partnerName].createOffer();

          await pc[partnerName].setLocalDescription(offer);

          socket.emit('sdp', {
            description: pc[partnerName].localDescription,
            to: partnerName,
            sender: socketId,
          });
        };
      }

      //send ice candidate to partnerNames
      pc[partnerName].onicecandidate = ({ candidate }) => {
        socket.emit('ice candidates', {
          candidate: candidate,
          to: partnerName,
          sender: socketId,
        });
      };

      //add
      pc[partnerName].ontrack = (e) => {
        let str = e.streams[0];
        if (document.getElementById(`${partnerName}-video`)) {
          document.getElementById(`${partnerName}-video`).srcObject = str;
        } else {
          //video elem
          let newVid = document.createElement('video');
          newVid.id = `${partnerName}-video`;
          newVid.srcObject = str;
          newVid.autoplay = true;
          newVid.className = 'remote-video';

          //video controls elements
          let controlDiv = document.createElement('div');
          controlDiv.className = 'remote-video-controls';
          controlDiv.innerHTML = `<i class="fa fa-microphone text-white pr-3 mute-remote-mic" title="Mute"></i>
                        <i class="fa fa-expand text-white expand-remote-video" title="Expand"></i>`;

          let usernameDiv = document.createElement('div');
          usernameDiv.className = 'user-name';
          usernameDiv.innerHTML = `${username || partnerName}`;

          //create a new div for card
          let cardDiv = document.createElement('div');
          cardDiv.className = 'card card-sm';
          cardDiv.id = partnerName;
          cardDiv.appendChild(newVid);
          cardDiv.appendChild(controlDiv);
          cardDiv.appendChild(usernameDiv);

          //put div in main-section elem
          const videosList = document.getElementById('videos');
          videosList.insertBefore(cardDiv, videosList.firstChild);

          h.adjustVideoElemSize();
        }
      };

      pc[partnerName].onconnectionstatechange = (d) => {
        switch (pc[partnerName].iceConnectionState) {
          case 'disconnected':
          case 'failed':
            h.closeVideo(partnerName);
            break;

          case 'closed':
            h.closeVideo(partnerName);
            break;
        }
      };

      pc[partnerName].onsignalingstatechange = (d) => {
        switch (pc[partnerName].signalingState) {
          case 'closed':
            console.log("Signalling state is 'closed'");
            h.closeVideo(partnerName);
            break;
        }
      };
    }

    function shareScreen() {
      h.shareScreen()
        .then((stream) => {
          h.toggleShareIcons(true);

          //disable the video toggle btns while sharing screen. This is to ensure clicking on the btn does not interfere with the screen sharing
          //It will be enabled was user stopped sharing screen
          h.toggleVideoBtnDisabled(true);

          //save my screen stream
          screen = stream;

          //share the new stream with all partners
          broadcastNewTracks(stream, 'video', false);

          //When the stop sharing button shown by the browser is clicked
          screen.getVideoTracks()[0].addEventListener('ended', () => {
            stopSharingScreen();
          });
        })
        .catch((e) => {
          console.error(e);
        });
    }

    function stopSharingScreen() {
      //enable video toggle btn
      h.toggleVideoBtnDisabled(false);

      return new Promise((res, rej) => {
        screen.getTracks().length
          ? screen.getTracks().forEach((track) => track.stop())
          : '';

        res();
      })
        .then(() => {
          h.toggleShareIcons(false);
          broadcastNewTracks(myStream, 'video');
        })
        .catch((e) => {
          console.error(e);
        });
    }

    function broadcastNewTracks(stream, type, mirrorMode = true) {
      h.setLocalStream(stream, mirrorMode);

      let track =
        type == 'audio'
          ? stream.getAudioTracks()[0]
          : stream.getVideoTracks()[0];

      for (let p in pc) {
        let pName = pc[p];

        if (typeof pc[pName] == 'object') {
          h.replaceTrack(track, pc[pName]);
        }
      }
    }

    function startRecording(stream) {
      mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'video/webm;codecs=vp9',
      });

      mediaRecorder.start(1000);

      mediaRecorder.ondataavailable = function (e) {
        recordedStream.push(e.data);
      };

      mediaRecorder.onstop = function () {
        h.saveRecordedStream(recordedStream, username);

        setTimeout(() => {
          recordedStream = [];
        }, 3000);
      };

      mediaRecorder.onerror = function (e) {
        console.error(e);
      };
    }
    
    document
      .getElementById('message-form-id')
      .addEventListener('submit', (e) => {
        e.preventDefault();
        const msg = e.target.message.value;
        if (msg.trim()) {
          sendMsg(msg);
          document.querySelector('#chat-input').value = '';
        }
      });

    // Open white board
    document.querySelector('.interaction-activity-item-info').onclick = () => {
      const url = `${window.location.origin}/meet/whiteboard?room=${uuidv4()}`;
      const msg = `Đã chia sẽ 1 whiteboard. Tham gia tại <br> <a href="${url}" style="color: blue" target="_blank">${url}</a>`;
      sendMsg(msg);
      window.open(url, '_blank');
    };

    document.querySelector('.sub-menu-white-board').onclick = () => {
      const url = `${window.location.origin}/meet/whiteboard?room=${uuidv4()}`;
      const msg = `Đã chia sẽ 1 whiteboard. Tham gia tại <br> <a href="${url}" style="color: blue" target="_blank">${url}</a>`;
      sendMsg(msg);
      window.open(url, '_blank');
    };

    // create new poll
    document.querySelector('.sub-menu-new-poll').onclick = () => {};

    //When the video icon is clicked
    document.getElementById('toggle-video').addEventListener('click', (e) => {
      e.preventDefault();

      let elem = document.getElementById('toggle-video');
      const image = elem.querySelector('img');
      elem.classList.toggle('active');

      if (myStream.getVideoTracks()[0].enabled) {
        image.src = 'assets/images/camera-off.svg';
        elem.setAttribute('title', 'Show Video');

        myStream.getVideoTracks()[0].enabled = false;
      } else {
        image.src = 'assets/images/camera.svg';
        elem.setAttribute('title', 'Hide Video');

        myStream.getVideoTracks()[0].enabled = true;
      }

      broadcastNewTracks(myStream, 'video');
    });

    //When the mute icon is clicked
    document.getElementById('toggle-mute').addEventListener('click', (e) => {
      e.preventDefault();

      let elem = document.getElementById('toggle-mute');
      const image = elem.querySelector('img');
      elem.classList.toggle('active');

      if (myStream.getAudioTracks()[0].enabled) {
        image.src = 'assets/images/micro-off.svg';
        elem.setAttribute('title', 'Unmute');
        
        myStream.getAudioTracks()[0].enabled = false;
      } else {
        image.src = 'assets/images/micro.svg';
        elem.setAttribute('title', 'Mute');
        myStream.getAudioTracks()[0].enabled = true;
      }

      broadcastNewTracks(myStream, 'audio');
    });

    //When user clicks the 'Share screen' button
    document.getElementById('share-screen').addEventListener('click', (e) => {
      e.preventDefault();

      if (
        screen &&
        screen.getVideoTracks().length &&
        screen.getVideoTracks()[0].readyState != 'ended'
      ) {
        stopSharingScreen();
      } else {
        shareScreen();
      }
    });

    //When record button is clicked
    document
      .getElementById('record')
      .addEventListener('click', async function (e) {
        if (this.classList.contains('record-active')) {
          this.classList.remove('record-active');
          mediaRecorder.stop();
          document.querySelector('.record-text').innerHTML = 'Record';
        } else {
          this.classList.add('record-active');
          document.querySelector('.record-text').innerHTML = 'Stop recording';
        }

        if (!mediaRecorder || mediaRecorder.state == 'inactive') {
          document.getElementById('record-video').click();
        } else if (mediaRecorder.state == 'paused') {
          mediaRecorder.resume();
        } else if (mediaRecorder.state == 'recording') {
          mediaRecorder.stop();
        }
      });

    //When user choose to record screen
    document.getElementById('record-screen').addEventListener('click', () => {
      if (screen && screen.getVideoTracks().length) {
        startRecording(screen);
      } else {
        h.shareScreen()
          .then((screenStream) => {
            startRecording(screenStream);
          })
          .catch(() => {});
      }
    });

    //When user choose to record own video
    document.getElementById('record-video').addEventListener('click', () => {
      if (myStream && myStream.getTracks().length) {
        startRecording(myStream);
      } else {
        h.getUserFullMedia()
          .then((videoStream) => {
            startRecording(videoStream);
          })
          .catch(() => {});
      }
    });

    document.querySelector('#renameBtn').onclick = () => {
      const newName = document.querySelector('#renameInput').value;
      if (!newName) return;
      sessionStorage.setItem('username', newName);
      username = newName;
      socket.emit('rename', { room, username: newName });
      document.querySelector('#renameCancelBtn').click();
    };

    document.querySelector('#create-poll-btn').onclick = () => {
      const inputValue = $('#create-poll-form').serializeArray();
      if (!inputValue[0]?.value || !inputValue[1]?.value) return;
      const newPoll = {
        id: uuidv4(),
        title: '',
        poll: {},
      };
      inputValue.forEach((input) => {
        if (input.name === 'title') newPoll.title = input.value;
        else {
          newPoll.poll[uuidv4()] = { value: input.value, vote: 0 };
        }
      });
      $('#create-poll-form').trigger('reset');
      $('.poll-input-block').not(':eq(0)').remove();
      $('.remove-poll-btn').first().css({ display: 'none' });
      $('.custom-success-toast').show();
      setTimeout(() => {
        $('.custom-success-toast').hide();
      }, 2500);
      socket.emit('newVote', {
        room: room,
        poll: newPoll,
        sender: `${username}`,
      });
      h.addVote({ poll: newPoll }, 'local', room, socket);
    };

    document.querySelector('#search-user-input').oninput = async (e) => {
      e.preventDefault();
      const keyword = e.target.value?.toLowerCase();
      const users = JSON.parse(sessionStorage.getItem('users'));
      const isHost = await h.checkIsHost();

      if (!keyword) {
        h.renderUserInRoom(users, socketId, isHost.success, socket);
        return;
      }

      const filterUser = users.filter((user) =>
        user.username?.toLowerCase()?.includes(keyword)
      );

      h.renderUserInRoom(filterUser, socketId, isHost.success, socket);
    };

    document.querySelector('#send-question-form').onsubmit = (e) => {
      e.preventDefault();
      const question = e.target.question.value;
      if(!question) return;
      const isAnonymous = document.querySelector('#checkbox-anonymous').checked; // true false
      const sender = isAnonymous ? 'Anonymous' : username;
      const time = moment().format('h:mm A');
      socket.emit('question', {
        room,
        id: uuidv4(),
        sender,
        question,
        time,
        status: 'open',
      });
      document.querySelector('#send-question-input').value = '';
      document.querySelector('#checkbox-anonymous').checked = false;
    };
  }
});
