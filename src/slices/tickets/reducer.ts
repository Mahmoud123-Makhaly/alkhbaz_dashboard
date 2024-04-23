import { createSlice } from '@reduxjs/toolkit';
import { getTicketsList, addNewTicket, updateTicket, deleteTicket } from './thunk';

export const initialState = {
  ticketsList: [],
};

const TicketsSlice = createSlice({
  name: 'TicketsSlice',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(getTicketsList.fulfilled, (state: any, action: any) => {
      state.ticketsList = action.payload.data;
      state.isTicketCreated = false;
      state.isTicketSuccess = true;
    });
    builder.addCase(getTicketsList.rejected, (state: any, action: any) => {
      state.error = action.payload.error || null;
      state.isTicketCreated = false;
      state.isTicketSuccess = false;
    });
    builder.addCase(addNewTicket.fulfilled, (state: any, action: any) => {
      state.ticketsList.push(action.payload.data);
      state.isTicketCreated = true;
      state.isTicketAdd = true;
      state.isTicketAddFail = false;
    });
    builder.addCase(addNewTicket.rejected, (state: any, action: any) => {
      state.error = action.payload.error || null;
      state.isTicketAdd = false;
      state.isTicketAddFail = true;
    });
    builder.addCase(updateTicket.fulfilled, (state: any, action: any) => {
      state.ticketsList = state.ticketsList.map(ticket =>
        ticket._id.toString() === action.payload.data._id.toString() ? { ...ticket, ...action.payload.data } : ticket,
      );
      state.isTicketUpdate = true;
      state.isTicketUpdateFail = false;
    });
    builder.addCase(updateTicket.rejected, (state: any, action: any) => {
      state.error = action.payload.error || null;
      state.isTicketUpdate = false;
      state.isTicketUpdateFail = true;
    });
    builder.addCase(deleteTicket.fulfilled, (state: any, action: any) => {
      state.ticketsList = state.ticketsList.filter(
        ticket => ticket._id.toString() !== action.payload.ticket.toString(),
      );
      state.isTicketDelete = true;
      state.isTicketDeleteFail = false;
    });
    builder.addCase(deleteTicket.rejected, (state: any, action: any) => {
      state.error = action.payload.error || null;
      state.isTicketDelete = false;
      state.isTicketDeleteFail = true;
    });
  },
});

export default TicketsSlice.reducer;
