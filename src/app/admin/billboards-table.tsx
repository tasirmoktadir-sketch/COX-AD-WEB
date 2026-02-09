"use client"

import * as React from "react"
import Image from "next/image"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "@/hooks/use-toast"
import type { Billboard } from "@/lib/types"
import placeholderImages from "@/lib/placeholder-images.json"

const editFormSchema = z.object({
  name: z.string().min(2, "Name is too short"),
  location: z.string().min(5, "Location is too short"),
  dimensions: z.string().min(3, "Invalid dimensions"),
  weeklyImpressions: z.coerce.number().int().positive("Must be a positive number"),
  imageId: z.string({ required_error: "Please select an image." }),
})

type EditFormValues = z.infer<typeof editFormSchema>

export function BillboardsTable({ initialData }: { initialData: Billboard[] }) {
  const [billboards, setBillboards] = React.useState(initialData)
  const [editingBillboard, setEditingBillboard] = React.useState<Billboard | null>(null)

  const form = useForm<EditFormValues>({
    resolver: zodResolver(editFormSchema),
    defaultValues: {
      name: "",
      location: "",
      dimensions: "",
      weeklyImpressions: 0,
      imageId: "",
    },
  })

  const selectedImageId = form.watch("imageId")
  const selectedImage = placeholderImages.placeholderImages.find(img => img.id === selectedImageId)

  const handleEditClick = (billboard: Billboard) => {
    setEditingBillboard(billboard)
    form.reset({
      name: billboard.name,
      location: billboard.location,
      dimensions: billboard.dimensions,
      weeklyImpressions: billboard.weeklyImpressions,
      imageId: billboard.imageId,
    })
  }

  const onSubmit = (values: EditFormValues) => {
    if (!editingBillboard) return;
    
    // In a real app, you'd call a server action here.
    // For now, we just update the local state.
    const updatedBillboards = billboards.map((b) =>
      b.id === editingBillboard.id ? { ...b, ...values } : b
    )
    setBillboards(updatedBillboards)
    
    toast({
      title: "Billboard Updated",
      description: `Successfully updated "${values.name}".`,
    })
    
    setEditingBillboard(null)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Billboard Listings</CardTitle>
        <CardDescription>View and manage all available billboard locations.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="border rounded-md">
            <Table>
                <TableHeader>
                <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead className="hidden md:table-cell">Location</TableHead>
                    <TableHead className="hidden sm:table-cell">Weekly Impressions</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                </TableRow>
                </TableHeader>
                <TableBody>
                {billboards.map((billboard) => (
                    <TableRow key={billboard.id}>
                    <TableCell className="font-medium">{billboard.name}</TableCell>
                    <TableCell className="hidden md:table-cell">{billboard.location}</TableCell>
                    <TableCell className="hidden sm:table-cell">{billboard.weeklyImpressions.toLocaleString()}</TableCell>
                    <TableCell className="text-right">
                        <Button variant="outline" size="sm" onClick={() => handleEditClick(billboard)} className="transition-transform duration-300 hover:scale-105">
                        Edit
                        </Button>
                    </TableCell>
                    </TableRow>
                ))}
                </TableBody>
            </Table>
        </div>

        <Sheet open={!!editingBillboard} onOpenChange={(open) => !open && setEditingBillboard(null)}>
          <SheetContent className="sm:max-w-lg">
            {editingBillboard && (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col h-full">
                  <SheetHeader>
                    <SheetTitle>Edit Billboard</SheetTitle>
                    <SheetDescription>
                      Make changes to the "{editingBillboard.name}" listing.
                    </SheetDescription>
                  </SheetHeader>
                  <div className="flex-grow py-6 pr-6 space-y-4 overflow-y-auto">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="location"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Location</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                     <FormField
                      control={form.control}
                      name="dimensions"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Dimensions</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., 14' x 48'" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="weeklyImpressions"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Weekly Impressions</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="imageId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Billboard Image</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select an image" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {placeholderImages.placeholderImages.map((image) => (
                                <SelectItem key={image.id} value={image.id}>
                                  {image.description}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    {selectedImage && (
                        <div className="rounded-md overflow-hidden border aspect-video relative bg-muted">
                            <Image 
                                src={selectedImage.imageUrl}
                                alt={selectedImage.description}
                                fill
                                className="object-cover"
                            />
                        </div>
                    )}
                  </div>
                  <SheetFooter className="pt-6">
                    <SheetClose asChild>
                      <Button type="button" variant="ghost">Cancel</Button>
                    </SheetClose>
                    <Button type="submit" className="transition-transform duration-300 hover:scale-105">Save Changes</Button>
                  </SheetFooter>
                </form>
              </Form>
            )}
          </SheetContent>
        </Sheet>
      </CardContent>
    </Card>
  )
}
