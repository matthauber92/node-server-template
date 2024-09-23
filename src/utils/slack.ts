import { WebClient } from '@slack/web-api'
import { GraphQLError } from 'graphql'

const CHANNEL_ID = process.env.SLACK_CHANNEL_ID

const webClient = new WebClient(process.env.SLACK_BOT_TOKEN)

interface SendFeedbackInput {
  text: string
}

export async function sendFeedback({
  text,
}: SendFeedbackInput): Promise<string | undefined> {
  if (!CHANNEL_ID) {
    throw new Error('Invalid server configuration')
  }

  try {
    const result = await webClient.chat.postMessage({
      channel: CHANNEL_ID,
      text,
    })

    if (result.ok) {
      return result.message?.text
    } else {
      console.error(result.error)
      throw new GraphQLError(`Feedback sent, but not successful`)
    }
  } catch (error) {
    console.error(error)
    throw new Error('Error sending feedback through Slack')
  }
}
