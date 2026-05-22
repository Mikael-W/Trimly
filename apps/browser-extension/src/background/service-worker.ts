chrome.runtime.onInstalled.addListener(() => {
  console.log('Trimly extension installed')
})

chrome.runtime.onMessage.addListener(
  (
    message: { type: string },
    _sender: chrome.runtime.MessageSender,
    sendResponse: (r: unknown) => void,
  ) => {
    if (message.type === 'PING') sendResponse({ type: 'PONG' })
  },
)
