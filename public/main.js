$(() => {
  $('table').on('click', '.delete', deleteMessage);
  $('button.create').on('click', openCreateMessageModal);
  $('#btnAddMessage').click(addMessage);
  $('table').on('click', '.edit', openEditMessageModal);
  $('#btnEditMessage').click(editMessage);
});

function deleteMessage() {
  let messageId = $(this).closest('tr').data('id');
  console.log('messageID: ', messageId);
  $.ajax(`/messages/${messageId}`, {
    method: 'DELETE',
  })
  .done((data) => {
    console.log('delete success!');
    renderList();
  })
  .fail(err => {
    console.log('err: ', err);
  })
}

function renderList() {
  $.get('/messages')
    .done(messages => {
      let $trs = messages.map(message => {
        let $tr = $('#template').clone();
        $tr.removeAttr('id');
        $tr.find('.msgTitle').text(message.title);
        $tr.find('.msgText').text(message.text);
        $tr.find('.msgAuthor').text(message.author);
        $tr.data('id', message.id);
        return $tr;
      })
      $('#messageList').empty().append($trs);
    })
}

function addMessage() {

  let $newTitle = $('#createTitle').val();
  let $newText = $('#createText').val();
  let $newAuthor = $('#createAuthor').val();

  let newObj = {title: $newTitle, text: $newText, author: $newAuthor};

  $.post('/messages', newObj)
  .done(givenID => {
    console.log(givenID);
    renderList();
  })
  .fail(err => {
    console.error('error: ', err);
  });
}

let $messageEditId;

function openEditMessageModal() {
  $messageEditId = $(this).closest('tr').data('id');
  $.get(`/messages/${$messageEditId}`)
  .done(message => {
    console.log($messageEditId);
    console.log(message.title);
    console.log(message.text);
    console.log(message.author);
    $('#messageEditModal').find('#editTitle').val(message.title);
    $('#messageEditModal').find('#editText').val(message.text);
    $('#messageEditModal').find('#editAuthor').val(message.author);
    $('#messageEditModal').modal();
  })
}

function editMessage() {
  console.log('messageID: ', $messageEditId);
  let $updateTitle = $('#messageEditModal').find('#editTitle').val();
  let $updateText = $('#messageEditModal').find('#editText').val();
  let $updateAuthor = $('#messageEditModal').find('#editAuthor').val();
  let updateMessage = {title: $updateTitle, text: $updateText, author: $updateAuthor, id: $messageEditId};
  $.ajax(`/messages/${$messageEditId}`, {
    method: 'PUT',
    data: updateMessage,
  })
  .done((data) => {
    console.log('Message updated!');
    renderList();
  })
  .fail(err => {
    console.log('err: ', err);
  })
}


function openCreateMessageModal() {
  $('#messageCreateModal').modal();
}
