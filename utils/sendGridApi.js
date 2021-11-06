const axios = require('axios');

const apiUrl = `${process.env.SENDGRID_API_URL}`;

SendGridApi = axios.create({
  baseURL: apiUrl,
  headers: {
    Authorization: `Bearer ${process.env.SENDGRID_API_KEY}`,
    'Content-Type': 'application/json',
  },
});

exports.EMAIL_LISTS = {
  SODALITE_GAMES: '4aa0f2ac-d324-4fb1-9533-c83bb4ddf588',
  BETA_TESTERS: '17e75a52-91e1-448c-90c8-be7b0f74ee14',
  ACCOUNT_HOLDERS: 'e4b553ff-157e-4cad-ba61-2705ecfb2ecd',
  ACCOUNT_HOLDERS_REMOVED: '857354be-e359-417c-9105-565aa2174c2d',
  ABERRATIONS_RPG: 'f75b81ea-3cb3-4b76-92f2-e1bc9d6cf346',
  ABERRATIONS_RPG_UNCONFIRMED: '44ec0646-39e8-4ab6-9091-90d065dbf0d7',
};

// all methods return true or the data if success, and false if not

exports.fetchSendGridContact = async email => {
  try {
    const { data } = await SendGridApi.post(`/marketing/contacts/search/emails`, { emails: [email] });
    return data.result[email].contact;
  } catch (err) {
    console.log(err.message);
    return false;
  }
};

exports.deleteSendGridContact = async contactId => {
  try {
    await SendGridApi.delete(`/marketing/contacts?ids=${contactId}`);
    return true;
  } catch (err) {
    console.log(err.message);
    return false;
  }
};

exports.subscribeEmailToList = async (listIds, email) => {
  try {
    await await SendGridApi.put('/marketing/contacts', {
      list_ids: listIds,
      contacts: [
        {
          email,
        },
      ],
    });
    return true;
  } catch (err) {
    console.log(err.message);
    return false;
  }
};

exports.removeEmailFromList = async (listId, contactId) => {
  try {
    await SendGridApi.delete(`/marketing/lists/${listId}/contacts?contact_ids=${contactId}`);
    return true;
  } catch (err) {
    console.log(err.message);
    return false;
  }
};
