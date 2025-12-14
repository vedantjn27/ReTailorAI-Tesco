"use client"

import { useState } from "react"
import { MessageSquare, User, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import { apiClient, type Review } from "@/lib/api-client"

export default function CollaborationPage() {
  const [fileId, setFileId] = useState("")
  const [username, setUsername] = useState("")
  const [comment, setComment] = useState("")
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const handleLoadReviews = async () => {
    if (!fileId) {
      toast({
        title: "File ID required",
        description: "Please enter a file ID to load reviews",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    try {
      const data = await apiClient.getReviews(fileId)
      setReviews(data)

      if (data.length === 0) {
        toast({
          title: "No reviews",
          description: "Be the first to leave a comment",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Could not load reviews",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleAddReview = async () => {
    if (!fileId || !username || !comment) {
      toast({
        title: "Missing information",
        description: "Please fill in all fields",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    try {
      const newReview = await apiClient.addReview(fileId, username, comment, [])
      setReviews([newReview, ...reviews])
      setComment("")

      toast({
        title: "Review added",
        description: "Your comment has been posted",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Could not add review",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteReview = async (reviewId: string) => {
    try {
      await apiClient.deleteReview(reviewId)
      setReviews(reviews.filter((r) => r.review_id !== reviewId))

      toast({
        title: "Review deleted",
        description: "Comment has been removed",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Could not delete review",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="border-b border-border bg-card px-8 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Collaboration</h1>
            <p className="mt-1 text-muted-foreground">Share feedback and review creatives with your team</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto p-8">
        <div className="mx-auto max-w-5xl">
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Review Form */}
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle>Add Review</CardTitle>
                <CardDescription>Leave feedback on a creative</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="file-id-collab" className="text-sm font-medium">
                    File ID
                  </label>
                  <div className="flex gap-2">
                    <Input
                      id="file-id-collab"
                      placeholder="Enter file ID..."
                      value={fileId}
                      onChange={(e) => setFileId(e.target.value)}
                    />
                    <Button variant="outline" onClick={handleLoadReviews} disabled={loading} className="bg-transparent">
                      Load
                    </Button>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <label htmlFor="username" className="text-sm font-medium">
                    Your Name
                  </label>
                  <Input
                    id="username"
                    placeholder="Enter your name..."
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="comment" className="text-sm font-medium">
                    Comment
                  </label>
                  <Textarea
                    id="comment"
                    placeholder="Share your feedback..."
                    className="min-h-32 resize-none"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                  />
                </div>

                <Button className="w-full" onClick={handleAddReview} disabled={loading}>
                  {loading ? "Posting..." : "Post Review"}
                </Button>
              </CardContent>
            </Card>

            {/* Reviews List */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Reviews</CardTitle>
                    <CardDescription>{reviews.length} comment(s)</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[600px] pr-4">
                  {reviews.length === 0 ? (
                    <div className="flex h-96 items-center justify-center">
                      <div className="text-center">
                        <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground opacity-20" />
                        <p className="mt-4 text-sm text-muted-foreground">No reviews yet</p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {reviews.map((review) => (
                        <Card key={review.review_id}>
                          <CardContent className="pt-6">
                            <div className="flex items-start justify-between">
                              <div className="flex items-start gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                                  <User className="h-5 w-5 text-primary" />
                                </div>
                                <div className="flex-1 space-y-1">
                                  <div className="flex items-center gap-2">
                                    <p className="font-medium">{review.user}</p>
                                    <Badge variant="outline">v{review.version}</Badge>
                                  </div>
                                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                    <Clock className="h-3 w-3" />
                                    {new Date(review.timestamp).toLocaleString()}
                                  </div>
                                </div>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteReview(review.review_id)}
                                className="text-destructive hover:text-destructive"
                              >
                                Delete
                              </Button>
                            </div>
                            <p className="mt-3 text-sm">{review.comment}</p>
                            {review.annotations.length > 0 && (
                              <div className="mt-3">
                                <Badge variant="secondary">{review.annotations.length} annotation(s)</Badge>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

          {/* Features Section */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Collaboration Features</CardTitle>
              <CardDescription>Work together seamlessly</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <h4 className="font-medium">Version History</h4>
                  <p className="text-sm text-muted-foreground">Track all feedback across different creative versions</p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium">Inline Comments</h4>
                  <p className="text-sm text-muted-foreground">Leave contextual feedback directly on creatives</p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium">Team Sharing</h4>
                  <p className="text-sm text-muted-foreground">Share links with stakeholders for quick reviews</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
